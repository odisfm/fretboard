import {FretboardDisplayContext} from "./FretboardDisplayContext.ts";
import { use } from 'react';

export function useFretboardDisplay() {
    const ctx = use(FretboardDisplayContext)
    if (!ctx) {
        throw new Error(`FretboardDisplayContext must be used within a provider`)
    }
    return ctx
}
