import {useState} from "react";
import {type Feature, FeatureContext} from "./FeatureContext.ts";

export function FeatureProvider({children, initialFeature}: {children: React.ReactNode, initialFeature: Feature}) {
    const [feature, setFeature] = useState<Feature>(initialFeature)

    return (
        <FeatureContext value={{feature, setFeature}}>
            {children}
        </FeatureContext>
    )
}
