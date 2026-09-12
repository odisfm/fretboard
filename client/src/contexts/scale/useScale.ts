import { use } from 'react';
import {ScaleContext} from "./ScaleContext.ts";

export function useScale() {
    const ctx = use(ScaleContext)
    if (!ctx) throw new Error('useScale must be used with a valid ScaleProvider')
    return ctx
}
