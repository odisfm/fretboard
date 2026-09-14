    import {useEffect, useState} from "react";
    import {type TestUserDataResponse, type TuningResponse} from "@fretboard/shared/types/apiResponses"
    import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
    import type {Tuning} from "@fretboard/shared/types/tuning";
    import {UserDataContext} from "./UserDataContext.ts";
    import {TuningProvider} from "../tuning/TuningProvider.tsx";
    import {ScaleProvider} from "../scale/ScaleProvider.tsx";

    const TEST_USER_ID = import.meta.env.VITE_TEST_USER_ID;
    const API_URL = import.meta.env.VITE_API_URL;

    export function UserDataProvider({children}: {children: React.ReactNode}) {
        const [scales, setScales] = useState<Scale[]>([])
        const [tunings, setTunings] = useState<Tuning[]>([])
        const [shapes, setShapes] = useState<ScaleShape[]>([])
        const [connectionStatus, setConnectionStatus] = useState<boolean>(false)
        const [initialised, setInitialised] = useState<boolean>(false)

        useEffect(() => {
            (async function () {
                const res = await fetch(`${API_URL}/user-data/${TEST_USER_ID}`);
                const json = await res.json();
                if (!res.ok) {
                    console.error(res);
                    return;
                }
                const data = json as TestUserDataResponse
                console.log(data)
                setScales(data.scales)
                setTunings(data.tunings)
                setShapes(data.shapes)
                setInitialised(true)
            })()

        }, [])

        async function createTuning(tuning: Tuning) {
            let res: Response
            try {
                res = await fetch(`${API_URL}/tuning`, {
                    method: "POST",
                    body: JSON.stringify(tuning),
                })
                if (!res.ok) {
                    if (res.status === 400) {
                        console.error(res)
                        return;
                    }
                }
            } catch (error) {
                console.error(error)
                // todo:
                setConnectionStatus(false)
            } finally {
                setTunings(prev => [...prev, tuning])
            }
            return tuning
        }

        async function deleteTuning(tuning: Tuning) {
            const id = tuning.id
            let res: Response
            try {
                res = await  fetch(`${API_URL}/tuning/${id}`, {
                    method: "DELETE",
                })
                if (!res.ok) {
                    if (res.status === 400) {
                        console.error(res)
                        return
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                const newTunings =
                    [...tunings].toSpliced(tunings.indexOf(tuning), 1)
                setTunings(newTunings)
            }
        }

        async function updateTuning(tuning: Tuning) {
            const id = tuning.id
            let updatedOnServer = false;
            let _tuning = tuning
            try {
                const res = await fetch(`${API_URL}/tuning`, {
                    method: "PATCH",
                    body: JSON.stringify(tuning),
                })
                if (!res.ok) {
                    console.error(res);
                    // todo:
                    return
                }
                const json: TuningResponse = await res.json();
                _tuning = json.tuning
                updatedOnServer = true;
            } catch (e) {
                console.error(e)
                setConnectionStatus(false);
            } finally {
                if (updatedOnServer) {
                    setConnectionStatus(true);
                }
                const _tunings = [...tunings]
                _tunings[_tunings.findIndex(s => s.id === id)] = _tuning
                setTunings(_tunings)
            }
        }

        async function toggleSavedShape(shape: ScaleShape) {
            let res: Response
            if (shapes.includes(shape)) {
                try {
                    res = await fetch(`${API_URL}/shape`, {
                        method: "DELETE",
                        body: JSON.stringify(shape),
                    })
                } catch (e) {
                    console.error(e)
                    // todo:
                    return
                }
                if (!res.ok) {
                    console.error(res);
                    return;
                }
                const newShapes = [...shapes].toSpliced(shapes.indexOf(shape), 1);
                setShapes(newShapes)

            } else {
                try {
                    res = await fetch(`${API_URL}/shape`, {
                        method: "PUT",
                        body: JSON.stringify(shape),
                    })
                } catch (e) {
                    console.error(e)
                    return
                }
                if (!res.ok) {
                    console.error(res);
                    return;
                }
                const newShapes = [...shapes, shape]
                setShapes(newShapes)
            }
        }

        useEffect(() => {
            localStorage.setItem("tunings", JSON.stringify(tunings))
            localStorage.setItem("shapes", JSON.stringify(shapes))
        }, [tunings, shapes]);

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
