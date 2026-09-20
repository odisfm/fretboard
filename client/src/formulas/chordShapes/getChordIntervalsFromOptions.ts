import type {ChordPickerOptions} from "../../ChordDemo.tsx";

export function getChordIntervalsFromOptions(chordPickerOptions: ChordPickerOptions){
    const intervals: number[] = []
    const options = chordPickerOptions
    switch (options.quality) {
        case "major":
            intervals.push(4)
            break
        case "minor":
            intervals.push(3)
            break
    }
    switch (options.sus) {
        case "sus2":
            intervals.push(2)
            break
        case "sus4":
            intervals.push(5)
    }
    switch (options.fifth) {
        case "perfect":
            intervals.push(7)
            break
        case "flat":
            intervals.push(6)
            break
        case "sharp":
            intervals.push(8)
            break
    }
    if (!options.fifth) {
        switch (options.augDim) {
            case "dim":
                intervals.push(6)
                break
            case "aug":
                intervals.push(8)
        }
    }
    switch (options.seventh) {
        case "major":
            intervals.push(11)
            break
        case "dom":
            intervals.push(10)
            break
        case "sixth":
            intervals.push(9)
    }
    switch (options.ninth) {
        case "flat":
            intervals.push(13)
            break
        case "natural":
            intervals.push(14)
            break
        case "sharp":
            intervals.push(15)
    }
    switch (options.eleventh) {
        case "flat":
            intervals.push(16)
            break
        case "natural":
            intervals.push(17)
            break
        case "sharp":
            intervals.push(18)
            break
    }
    switch (options.thirteenth) {
        case "flat":
            intervals.push(20)
            break
        case "natural":
            intervals.push(21)
            break
        case "sharp":
            intervals.push(22)
    }
    switch (options.add2) {
        case "add2":
            intervals.push(2)
            break
        case "add9":
            intervals.push(12)
    }
    switch (options.add4) {
        case "add4":
            intervals.push(5)
            break
        case "add11":
            intervals.push(17)
            break
    }
    switch (options.add6) {
        case "add6":
            intervals.push(9)
            break
        case "add13":
            intervals.push(21)
            break
    }

    return [...new Set(intervals)].sort((a, b) => a - b);
}
