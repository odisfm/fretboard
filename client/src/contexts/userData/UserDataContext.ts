import { createContext } from "react";
import type {Scale, ScaleShape} from "@fretboard/shared/src/types/scale.ts";
import type {Tuning} from "@fretboard/shared/src/types/tuning.ts";

type UserDataContextValue = {
    scales: Scale[]
    tunings: Tuning[]
    shapes: ScaleShape[]
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)
