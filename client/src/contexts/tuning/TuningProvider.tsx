import { useState } from "react";
import { TuningContext } from "./TuningContext.ts";
import { type Tuning, eStandardTuning } from "@fretboard/shared/types/tuning"

export function TuningProvider({children}: {children: React.ReactNode}) {
    const [tuning, setTuning] = useState<Tuning>(eStandardTuning);

    return (
        <TuningContext value={{
            tuning,
            setTuning
        }}>
            {children}
        </TuningContext>
    )
}
