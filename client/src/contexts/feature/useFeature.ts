import {use} from "react";
import { FeatureContext } from "./FeatureContext";

export function useFeature() {
    const ctx = use(FeatureContext);
    if (!ctx) throw new Error("useFeature must be used within a FeatureProvider");
    return ctx;
}