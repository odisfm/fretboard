import {sumArray} from "./sumArray";

export function chordIntervalsToScaleIntervals(intervals: number[]): number[] {
    const cIntervals: number[] = [];
    cIntervals.push(intervals[0])
    for (let i = 1; i < intervals.length; i++) {
        cIntervals.push(intervals[i] - sumArray(cIntervals))
    }
    const sum = sumArray(cIntervals);
    cIntervals.push(12 - (sum % 12))

    return cIntervals;
}
