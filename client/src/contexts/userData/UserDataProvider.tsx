import {useEffect, useState} from "react";
import {type TestUserDataResponse} from "@fretboard/shared/src/types/apiResponses.ts"
import type {Scale} from "@fretboard/shared/src/types/scale.ts";
import type {Tuning} from "@fretboard/shared/src/types/tuning.ts";
import {UserDataContext} from "./UserDataContext.ts";

const TEST_USER_ID = import.meta.env.VITE_TEST_USER_ID;
const API_URL = import.meta.env.VITE_API_URL;

export function UserDataProvider({children}: {children: React.ReactNode}) {
    const [scales, setScales] = useState<Scale[]>([])
    const [tunings, setTunings] = useState<Tuning[]>([])

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
        })()

    }, [])

    return (
        <UserDataContext value={{
            scales,
            tunings,
            shapes: []
        }}>
            {children}
        </UserDataContext>
    )
}
