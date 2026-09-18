import {use} from "react";
import {ChordContext} from "./ChordContext.ts";

export function useChord() {
    const context = use(ChordContext);
    if (!context) throw new Error('useChord must be used within a ChordProvider');
    return context;
}