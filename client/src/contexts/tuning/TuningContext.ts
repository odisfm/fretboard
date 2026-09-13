import { createContext } from "react";
import { type Tuning } from "@fretboard/shared/types/tuning"

type TuningContextValue = {
    tuning: Tuning;
    setTuning: (tuning: Tuning) => void;
};

export const TuningContext = createContext<TuningContextValue | null>(null);
