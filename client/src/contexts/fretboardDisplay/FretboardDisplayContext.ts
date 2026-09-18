import {createContext} from "react";
export type FretboardDisplayVariant = "main" | "preview"

export type FretboardDisplayContextValue = {
    variant: FretboardDisplayVariant,
    zoom: number,
    outShapeOpacity: number,
    type: "scale" | "chord"
}

export const FretboardDisplayContext =
    createContext<FretboardDisplayContextValue | null>(null)
