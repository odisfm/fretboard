import { createContext } from "react";
import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import type {Tuning} from "@fretboard/shared/types/tuning";

type UserDataContextValue = {
    scales: Scale[]
    tunings: Tuning[]
    shapes: ScaleShape[]
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)
