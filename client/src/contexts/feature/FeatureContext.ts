import { createContext } from "react"

export type Feature = "scale" | "chord"

export type FeatureContextValue = {
    feature: Feature
    setFeature: (view: Feature) => void
}

export const FeatureContext = createContext<FeatureContextValue | null>(null)
