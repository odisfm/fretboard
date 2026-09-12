import { use } from 'react';
import { TuningContext } from './TuningContext';

export function useTuning() {
    const ctx = use(TuningContext);
    if (!ctx) throw new Error('useTuning must be used within a TuningProvider');
    return ctx;
}
