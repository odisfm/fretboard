import {createContext} from "react";
export type FretboardDisplayVariant = "main" | "preview"

export type FretboardDisplayContextValue = {
    variant: FretboardDisplayVariant,
    zoom: number,
    outShapeOpacity: number
}

export const FretboardDisplayContext =
    createContext<FretboardDisplayContextValue | null>(null)
