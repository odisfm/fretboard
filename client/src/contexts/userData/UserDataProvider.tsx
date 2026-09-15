import {useCallback, useEffect, useRef, useState} from "react";
import {type TestUserDataResponse, type TuningResponse} from "@fretboard/shared/types/apiResponses"
import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import type {Tuning} from "@fretboard/shared/types/tuning";
import {UserDataContext} from "./UserDataContext.ts";
import {TuningProvider} from "../tuning/TuningProvider.tsx";
import {ScaleProvider} from "../scale/ScaleProvider.tsx";
import {reconcileUserData} from "./reconcileUserData.ts";

const TEST_USER_ID = import.meta.env.VITE_TEST_USER_ID;
const API_URL = import.meta.env.VITE_API_URL;
const BACKOFF_BASE = 500
const BACKOFF_CAP = 1000 * 120

const storedTunings: Tuning[] = JSON.parse(localStorage.getItem("tunings") || "[]")
const storedShapes: ScaleShape[] = JSON.parse(localStorage.getItem("shapes") || "[]")
const storedScales: Scale[] = JSON.parse(localStorage.getItem("scales") || "[]")

const canInitialise = Boolean(storedTunings.length && storedScales.length)

function scheduleDeleteTuning(id: string) {
    const existing: string[] = JSON.parse(localStorage.getItem("deletedTunings") || "[]")
    localStorage.setItem("deletedTunings", JSON.stringify([...existing, id]))
}

function scheduleDeleteShape(id: string) {
    const existing: string[] = JSON.parse(localStorage.getItem("deletedShapes") || "[]")
    localStorage.setItem("deletedShapes", JSON.stringify([...existing, id]))
}

// function scheduleDeleteScale(id: string) {
//     const existing: string[] = JSON.parse(localStorage.getItem("deletedScales") || "[]")
//     localStorage.setItem("deletedScales", JSON.stringify([...existing, id]))
// }

export function UserDataProvider({children}: {children: React.ReactNode}) {
    const [scales, setScales] = useState<Scale[]>(storedScales)
    const [tunings, setTunings] = useState<Tuning[]>(storedTunings)
    const [shapes, setShapes] = useState<ScaleShape[]>(storedShapes)
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false)
    const [needsReconcile, setNeedsReconcile] = useState<boolean>(true)
    const [initialised, setInitialised] = useState<boolean>(false)
    const [waitOnServer, setWaitOnServer] = useState<boolean>(true)

    const tuningsRef = useRef(tunings)
    const shapesRef = useRef(shapes)
    const scalesRef = useRef(scales)
    const initialisedRef = useRef(initialised)
    const needsReconcileRef = useRef(needsReconcile)

    useEffect(() => {
        tuningsRef.current = tunings
        shapesRef.current = shapes
        scalesRef.current = scales
        initialisedRef.current = initialised
        needsReconcileRef.current = needsReconcile
    }, [tunings, shapes, scales, initialised, needsReconcile])

    const reconcileWithServer = useCallback(async () => {
        if (!needsReconcileRef.current) return
        setWaitOnServer(true)
        let res: Response
        try {
            res = await fetch(`${API_URL}/user-data/${TEST_USER_ID}`);
            if (!res.ok) {
                console.error(res);
                setWaitOnServer(false)
                setConnectionStatus(false)
                return;
            }
        } catch (e) {
            console.error(e);
            if (!initialisedRef.current && canInitialise) {
                setInitialised(true);
            }
            setWaitOnServer(false)
            setConnectionStatus(false)
            return;
        }
        const json = await res.json();
        const data = json as TestUserDataResponse

        const deletedTunings = JSON.parse(localStorage.getItem("deletedTunings") || "[]")
        const deletedShapes = JSON.parse(localStorage.getItem("deletedShapes") || "[]")
        const deletedScales = JSON.parse(localStorage.getItem("deletedScales") || "[]")

        const {reconciledTunings, reconciledScales, reconciledShapes} = reconcileUserData(
            tuningsRef.current, data.tunings, shapesRef.current, data.shapes, scalesRef.current, data.scales,
            deletedTunings, deletedShapes, deletedScales
        )

        try {
            const reconcileBody = {
                tunings: reconciledTunings,
                shapes: reconciledShapes,
                scales: reconciledScales,
            }
            const updateRes = await fetch(`${API_URL}/user-data/${TEST_USER_ID}`,
                {
                    method: "POST",
                    body: JSON.stringify(reconcileBody),
                })
            const json: TestUserDataResponse = await updateRes.json();
            localStorage.setItem("deletedTunings", "[]")
            localStorage.setItem("deletedShapes", "[]")
            localStorage.setItem("deletedScales", "[]")

            setTunings(json.tunings)
            setShapes(json.shapes)
            setScales(json.scales)

            setInitialised(true)
            setConnectionStatus(true)
            setWaitOnServer(false)
            setNeedsReconcile(false)
        } catch (e) {
            console.error(e)
            setConnectionStatus(false)
            setWaitOnServer(false)
        }
    }, [])

    useEffect(() => {
        if (!needsReconcile) return

        let cancelled = false
        let timeoutId: ReturnType<typeof setTimeout>
        let backoff = BACKOFF_BASE

        const attempt = async () => {
            if (cancelled) return
            await reconcileWithServer()
            if (cancelled) return
            timeoutId = setTimeout(() => {
                if (!cancelled) attempt()
            }, backoff)
            backoff = Math.min(BACKOFF_CAP, backoff * 2)
        }

        attempt()

        return () => {
            cancelled = true
            clearTimeout(timeoutId)
        }
    }, [needsReconcile, reconcileWithServer])

    async function createTuning(tuning: Tuning) {
        let res: Response
        setWaitOnServer(true)
        try {
            res = await fetch(`${API_URL}/tuning`, {
                method: "POST",
                body: JSON.stringify(tuning),
            })
            if (!res.ok) {
                if (res.status === 400) {
                    //todo:
                    console.error(res)
                } else {
                    console.error(res);
                    setNeedsReconcile(true)
                }
                setWaitOnServer(false)
                return;
            }
        } catch (error) {
            console.error(error)
            // todo:
            setConnectionStatus(false)
            setWaitOnServer(false)
            setNeedsReconcile(true)
        } finally {
            setTunings(prev => [...prev, tuning])
            setWaitOnServer(false)
        }
        return tuning
    }

    async function deleteTuning(tuning: Tuning) {
        const id = tuning.id
        let res: Response
        setWaitOnServer(true)
        try {
            res = await fetch(`${API_URL}/tuning/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) {
                if (res.status === 400) {
                    //todo:
                    console.error(res)
                } else {
                    console.error(res);
                    setNeedsReconcile(true)
                }
                scheduleDeleteTuning(tuning.id)
                setWaitOnServer(false)
                return;
            }
        } catch (error) {
            console.error(error)
            scheduleDeleteTuning(tuning.id)
            setNeedsReconcile(true)
            setConnectionStatus(false)
        } finally {
            const newTunings =
                [...tunings].toSpliced(tunings.indexOf(tuning), 1)
            setTunings(newTunings)
            setWaitOnServer(false)
        }
    }

    async function updateTuning(tuning: Tuning) {
        const id = tuning.id
        let updatedOnServer = false;
        let _tuning = tuning
        setWaitOnServer(true)
        try {
            const res = await fetch(`${API_URL}/tuning`, {
                method: "PATCH",
                body: JSON.stringify(tuning),
            })
            if (!res.ok) {
                if (res.status === 400) {
                    //todo:
                    console.error(res)
                } else {
                    console.error(res);
                    setNeedsReconcile(true)
                }
                setWaitOnServer(false)
                return;
            }
            const json: TuningResponse = await res.json();
            _tuning = json.tuning
            updatedOnServer = true;
        } catch (e) {
            console.error(e)
            setConnectionStatus(false);
            setNeedsReconcile(true)
        } finally {
            if (updatedOnServer) {
                setConnectionStatus(true);
            }
            const _tunings = [...tunings]
            _tunings[_tunings.findIndex(s => s.id === id)] = _tuning
            setTunings(_tunings)
            setWaitOnServer(false)
        }
    }

    async function toggleSavedShape(shape: ScaleShape) {
        let res: Response
        setWaitOnServer(true)
        if (shapes.includes(shape)) {
            try {
                res = await fetch(`${API_URL}/shape`, {
                    method: "DELETE",
                    body: JSON.stringify(shape),
                })
            } catch (e) {
                console.error(e)
                // todo:
                setWaitOnServer(false)
                setNeedsReconcile(true)
                scheduleDeleteShape(shape.id)
                return
            }
            if (!res.ok) {
                if (res.status === 400) {
                    //todo:
                    console.error(res)
                } else {
                    console.error(res);
                    setNeedsReconcile(true)
                }
                scheduleDeleteShape(shape.id)
                setWaitOnServer(false)
                return;
            }
            const newShapes = [...shapes].toSpliced(shapes.indexOf(shape), 1);
            setShapes(newShapes)
            setWaitOnServer(false)

        } else {
            try {
                res = await fetch(`${API_URL}/shape`, {
                    method: "PUT",
                    body: JSON.stringify(shape),
                })
            } catch (e) {
                console.error(e)
                setWaitOnServer(false)
                setNeedsReconcile(true)
                return
            }
            if (!res.ok) {
                if (res.status === 400) {
                    //todo:
                    console.error(res)
                } else {
                    console.error(res);
                    setNeedsReconcile(true)
                }
                setWaitOnServer(false)
                return;
            }
            const newShapes = [...shapes, shape]
            setShapes(newShapes)
        }
    }

    useEffect(() => {
        localStorage.setItem("tunings", JSON.stringify(tunings))
        localStorage.setItem("shapes", JSON.stringify(shapes))
        localStorage.setItem("scales", JSON.stringify(scales))
    }, [tunings, shapes, scales]);

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
            {initialised &&
                <>
                    <TuningProvider initialTuning={tunings[0]}>
                        <ScaleProvider initialScale={scales[0]}>
                            {children}
                        </ScaleProvider>
                    </TuningProvider>
                </>
            }
            {!initialised && <span>loading...</span>}

        </UserDataContext>
    )
}
