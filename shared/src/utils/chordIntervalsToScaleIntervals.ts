export function chordIntervalsToScaleIntervals(intervals: number[]): number[] {
    const degrees = [...new Set(intervals)]
        .filter(i => i !== 0)   // tonic is implied
        .sort((a, b) => a - b);

    if (degrees.length === 0) return [12];

    const steps: number[] = [];
    let prev = 0;
    for (const d of degrees) {
        steps.push(d - prev);
        prev = d;
    }
    steps.push(12 * (Math.floor(prev / 12) + 1) - prev);

    return steps;
}