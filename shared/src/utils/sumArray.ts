export function sumArray(array: number[]): number {
    return array.reduce((prev, current) => prev + current, 0);
}
