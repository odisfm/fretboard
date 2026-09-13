import { useState } from "react";
import { TuningContext } from "./TuningContext.ts";
import { type Tuning } from "@fretboard/shared/types/tuning"

export function TuningProvider({initialTuning, children}: {initialTuning: Tuning, children: React.ReactNode}) {
    const [tuning, setTuning] = useState<Tuning>(initialTuning);
    return (
        <TuningContext value={{
            tuning,
            setTuning
        }}>
            {children}
        </TuningContext>
    )
}
