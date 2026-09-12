export default function sumToIndex(arr: number[], index: number): number {
    if (index >= arr.length) {
        throw new RangeError("Index greater than array length")
    } else if (index < 0) {
        throw new RangeError("Negative index")
    }
    let sum = 0;
    for (let i = 0; i <= index; i++) {
        sum += arr[i];
    }
    return sum;
}
