import {useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction} from "react";
import {type TestUserDataResponse, type TuningResponse} from "@fretboard/shared/types/apiResponses"
import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import type {Tuning} from "@fretboard/shared/types/tuning";
import {UserDataContext} from "./UserDataContext.ts";
import {TuningProvider} from "../tuning/TuningProvider.tsx";
import {ScaleProvider} from "../scale/ScaleProvider.tsx";
import {reconcileUserData} from "./reconcileUserData.ts";
import {useAuth} from "../auth/useAuth.ts";
import {defaultScales} from "@fretboard/shared/scripts/onboarding/defaultScales";
import {defaultTunings} from "@fretboard/shared/scripts/onboarding/defaultTunings";
import {v4 as createUuid} from "uuid";
import {LexoRank} from "@dalet-oss/lexorank";
import {ChordProvider} from "../chord/ChordProvider.tsx";

const API_URL = import.meta.env.VITE_API_URL;
const BACKOFF_BASE = 500
const BACKOFF_CAP = 1000 * 120

function readLocal<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch (e) {
        console.error(`Failed to read "${key}" from localStorage`, e);
        return fallback;
    }
}

function usePersistedState<T>(key: string, initial: () => T) {
    const [state, setState] = useState<T>(initial);
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState] as const;
}

function buildDefaultScales(): Scale[] {
    let rank = LexoRank.middle();
    return defaultScales.map(s => {
        rank = rank.genNext();
        return {...s, id: createUuid(), order: rank["value"]};
    });
}

function buildDefaultTunings(): Tuning[] {
    let rank = LexoRank.middle();
    return defaultTunings.map(t => {
        rank = rank.genNext();
        return {...t, id: createUuid(), order: rank["value"]};
    });
}

export function UserDataProvider({children}: {children: React.ReactNode}) {
    const authContext = useAuth();

    const [tunings, setTunings] = usePersistedState<Tuning[]>("tunings", () => {
        const stored = readLocal<Tuning[]>("tunings", []);
        if (stored.length) return stored;
        return authContext.auth ? [] : buildDefaultTunings();
    });
    const [scales, setScales] = usePersistedState<Scale[]>("scales", () => {
        const stored = readLocal<Scale[]>("scales", []);
        if (stored.length) return stored;
        return authContext.auth ? [] : buildDefaultScales();
    });
    const [shapes, setShapes] = usePersistedState<ScaleShape[]>("shapes", () =>
        readLocal<ScaleShape[]>("shapes", [])
    );

    const [deletedTunings, setDeletedTunings] = usePersistedState<string[]>(
        "deletedTunings", () => readLocal<string[]>("deletedTunings", [])
    );
    const [deletedShapes, setDeletedShapes] = usePersistedState<string[]>(
        "deletedShapes", () => readLocal<string[]>("deletedShapes", [])
    );

    const [connectionStatus, setConnectionStatus] = useState(true)
    const [waitOnServer, setWaitOnServer] = useState(false)
    const [needsReconcile, setNeedsReconcile] = useState(true)

    const [dataVersion, setDataVersion] = useState(0)

    const [initialised, setInitialised] = useState(
        () => tunings.length > 0 || scales.length > 0 || !authContext.auth
    )

    const tuningsRef = useRef(tunings)
    const shapesRef = useRef(shapes)
    const scalesRef = useRef(scales)
    const deletedTuningsRef = useRef(deletedTunings)
    const deletedShapesRef = useRef(deletedShapes)
    const prevAuthRef = useRef(authContext.auth)

    useEffect(() => {
        tuningsRef.current = tunings
        shapesRef.current = shapes
        scalesRef.current = scales
        deletedTuningsRef.current = deletedTunings
        deletedShapesRef.current = deletedShapes
    }, [tunings, shapes, scales, deletedTunings, deletedShapes])

    const runMutation = useCallback(async <T,>(
        setState: Dispatch<SetStateAction<T>>,
        apply: (prev: T) => T,
        request: () => Promise<Response>,
        options?: {onServerData?: (json: never) => void; onOffline?: () => void}
    ) => {
        setState(apply)
        setWaitOnServer(true)
        try {
            const res = await request()
            if (!res.ok) {
                console.error(res)
                setNeedsReconcile(true)
                options?.onOffline?.()
                return
            }
            setConnectionStatus(true)
            if (options?.onServerData) {
                options.onServerData(await res.json() as unknown as never)
            }
        } catch (e) {
            console.error(e)
            setConnectionStatus(false)
            setNeedsReconcile(true)
            options?.onOffline?.()
        } finally {
            setWaitOnServer(false)
        }
    }, [])

    const createTuning = useCallback(async (tuning: Tuning) => {
        await runMutation(
            setTunings,
            prev => [...prev, tuning],
            () => fetch(`${API_URL}/tuning`, {
                method: "POST",
                body: JSON.stringify(tuning),
                credentials: "include",
            }),
        )
        return tuning
    }, [runMutation, setTunings])

    const deleteTuning = useCallback((tuning: Tuning) => runMutation(
        setTunings,
        prev => prev.filter(t => t.id !== tuning.id),
        () => fetch(`${API_URL}/tuning/${tuning.id}`, {
            method: "DELETE",
            credentials: "include",
        }),
        {onOffline: () => setDeletedTunings(prev => [...prev, tuning.id])}
    ), [runMutation, setTunings, setDeletedTunings])

    const updateTuning = useCallback((tuning: Tuning) => runMutation(
        setTunings,
        prev => prev.map(t => t.id === tuning.id ? tuning : t),
        () => fetch(`${API_URL}/tuning`, {
            method: "PATCH",
            body: JSON.stringify(tuning),
            credentials: "include",
        }),
        {
            onServerData: (json: TuningResponse) =>
                setTunings(prev => prev.map(t => t.id === json.tuning.id ? json.tuning : t))
        }
    ), [runMutation, setTunings])

    const toggleSavedShape = useCallback((shape: ScaleShape) => {
        const isSaved = shapesRef.current.some(s => s.id === shape.id)
        if (isSaved) {
            return runMutation(
                setShapes,
                prev => prev.filter(s => s.id !== shape.id),
                () => fetch(`${API_URL}/shape`, {
                    method: "DELETE",
                    body: JSON.stringify(shape),
                    credentials: "include",
                }),
                {onOffline: () => setDeletedShapes(prev => [...prev, shape.id])}
            )
        }
        return runMutation(
            setShapes,
            prev => [...prev, shape],
            () => fetch(`${API_URL}/shape`, {
                method: "PUT",
                body: JSON.stringify(shape),
                credentials: "include",
            }),
        )
    }, [runMutation, setShapes, setDeletedShapes])

    const syncWithServer = useCallback(async (): Promise<boolean> => {
        setWaitOnServer(true)
        let res: Response
        try {
            res = await fetch(`${API_URL}/user-data`, {credentials: "include"})
        } catch (e) {
            console.error(e)
            setConnectionStatus(false)
            setWaitOnServer(false)
            return false
        }
        if (!res.ok) {
            console.error(res)
            setConnectionStatus(false)
            setWaitOnServer(false)
            return false
        }
        setConnectionStatus(true)
        const data = (await res.json()) as TestUserDataResponse

        if (authContext.pendingSyncAction === "pull") {
            setTunings(data.tunings)
            setScales(data.scales)
            setShapes(data.shapes)
            setDeletedTunings([])
            setDeletedShapes([])
            setNeedsReconcile(false)
            setInitialised(true)
            setWaitOnServer(false)
            setDataVersion(v => v + 1)
            authContext.clearPendingSyncAction()
            return true
        }

        const {reconciledTunings, reconciledScales, reconciledShapes} = reconcileUserData(
            tuningsRef.current, data.tunings,
            shapesRef.current, data.shapes,
            scalesRef.current, data.scales,
            deletedTuningsRef.current, deletedShapesRef.current, [],
        )

        try {
            const updateRes = await fetch(`${API_URL}/user-data`, {
                method: "POST",
                body: JSON.stringify({
                    tunings: reconciledTunings,
                    shapes: reconciledShapes,
                    scales: reconciledScales,
                }),
                credentials: "include",
            })
            if (!updateRes.ok) {
                console.error(updateRes)
                return false
            }
            const json = (await updateRes.json()) as TestUserDataResponse
            setTunings(json.tunings)
            setScales(json.scales)
            setShapes(json.shapes)
            setDeletedTunings([])
            setDeletedShapes([])
            setNeedsReconcile(false)
            setInitialised(true)
            setConnectionStatus(true)
            if (authContext.pendingSyncAction === "push") {
                setDataVersion(v => v + 1)
                authContext.clearPendingSyncAction()
            }
            return true
        } catch (e) {
            console.error(e)
            setConnectionStatus(false)
            return false
        } finally {
            setWaitOnServer(false)
        }

    }, [
        authContext, setTunings, setScales, setShapes, setDeletedTunings, setDeletedShapes,
    ])

    useEffect(() => {
        if (!authContext.auth) return
        if (!needsReconcile && !authContext.pendingSyncAction) return

        let cancelled = false
        let timeoutId: ReturnType<typeof setTimeout>
        let backoff = BACKOFF_BASE

        const attempt = async () => {
            if (cancelled) return
            const ok = await syncWithServer()
            if (cancelled || ok) return
            timeoutId = setTimeout(attempt, backoff)
            backoff = Math.min(BACKOFF_CAP, backoff * 2)
        }

        attempt()
        window.addEventListener("online", attempt)

        return () => {
            cancelled = true
            clearTimeout(timeoutId)
            window.removeEventListener("online", attempt)
        }
    }, [authContext.auth, authContext.pendingSyncAction, needsReconcile, syncWithServer])

    useEffect(() => {
        const wasAuthenticated = prevAuthRef.current
        prevAuthRef.current = authContext.auth
        if (wasAuthenticated && !authContext.auth) {
            setTunings(buildDefaultTunings())
            setScales(buildDefaultScales())
            setShapes([])
            setDeletedTunings([])
            setDeletedShapes([])
            setNeedsReconcile(false)
            setDataVersion(v => v + 1)
        }
    }, [authContext.auth, setTunings, setScales, setShapes, setDeletedTunings, setDeletedShapes])

    return (
        <UserDataContext value={{
            scales,
            tunings,
            shapes,
            createTuning,
            deleteTuning,
            updateTuning,
            connectionStatus,
            initialised,
            toggleSavedShape,
            waitOnServer
        }}>
            {initialised ? (
                <TuningProvider key={dataVersion} initialTuning={tunings[0]}>
                    <ScaleProvider key={dataVersion} initialScale={scales[0]}>
                        <ChordProvider key={dataVersion} initialChord={{
                            root: "C",
                            intervals: [4, 7, 11],
                            quality: "Major",
                            id: ""
                        }}>
                        {children}
                        </ChordProvider>
                    </ScaleProvider>
                </TuningProvider>
            ) : (
                <span>loading...</span>
            )}
        </UserDataContext>
    )
}