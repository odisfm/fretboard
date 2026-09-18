import sumToIndex from "@fretboard/shared/utils/sumToIndex"

const MAJOR_SCALE_FORMULA = [2, 2, 1, 2, 2, 2, 1]
const MAJOR_SCALE_FORMULA_FROM_TONIC = [2, 4, 5, 7, 9, 11, 12]
const MAJOR_SCALE_DEGREE_NUMBERS = [2, 3, 4, 5, 6, 7, 1]

const MAJOR_INTERVAL_LABELS = ["M2", "M3", "P4", "P5", "M6", "M7", "P8"]

const SEMITONES_PER_OCTAVE = 12
const DEGREES_PER_OCTAVE = 7

// Interval style tops out at a 14th, so a note is never raised by more than one
// octave. Anything higher wraps back into the compound range rather than
// producing 15ths, 16ths and beyond.
const MAX_OCTAVE_SHIFT = 1

// Degree numbers that are diminished rather than minor when lowered
const PERFECT_DEGREE_NUMBERS = new Set([1, 4, 5, 8, 11, 12, 15])

// Tiebreaker for notes equidistant between two degrees
const EQUIDISTANT_DEGREE_LABEL: Record<number, string> = {
    1:  "b2",
    3:  "b3",
    6:  "b5",
    8:  "#5",
    10: "b7",
}

const EQUIDISTANT_INTERVAL_LABEL: Record<string, string> = {
    b2:   "m2",
    b3:   "m3",
    b5:   "d5",
    "#5": "A5",
    b7:   "m7",
}

type Style = "nashville" | "interval"

function loweredIntervalLabel(degreeNumber: number): string {
    const quality = PERFECT_DEGREE_NUMBERS.has(degreeNumber) ? "d" : "m"

    return `${quality}${degreeNumber}`
}

// "M2" raised an octave is "M9", "m7" raised an octave is "m14"
function raiseIntervalByOctaves(label: string, octaves: number): string {
    if (octaves < 1) {
        return label
    }

    const match = /^([A-Za-z]+)(\d+)$/.exec(label)

    if (!match) {
        return label
    }

    const [, quality, degreeNumber] = match

    return `${quality}${Number(degreeNumber) + DEGREES_PER_OCTAVE * octaves}`
}

export default function getScaleDegreeNumbers(
    input: number[],
    style: Style = "nashville",
): string[] {
    const output: string[] = [
        style === "interval" ? "P1" : "1",
    ]

    const inputFromTonic: number[] = input.map((_, i) => sumToIndex(input, i))
    const span = inputFromTonic[inputFromTonic.length - 1] ?? 0

    // The positional comparison below only holds for a seven note scale that
    // closes at the octave, so a seven note shape that spans further than that
    // falls through to the lookup based branch.
    if (
        input.length === MAJOR_SCALE_FORMULA.length &&
        span === SEMITONES_PER_OCTAVE
    ) {
        for (let i = 0; i < input.length - 1; i++) {
            const major = MAJOR_SCALE_FORMULA_FROM_TONIC[i]
            const user = inputFromTonic[i]

            if (user === major) {
                output.push(
                    style === "interval"
                        ? MAJOR_INTERVAL_LABELS[i]
                        : `${i + 2}`,
                )
            } else if (user < major) {
                output.push(
                    style === "interval"
                        ? `m${i + 2}`
                        : `b${i + 2}`,
                )
            } else if (user > major) {
                output.push(
                    style === "interval"
                        ? `A${i + 2}`
                        : `#${i + 2}`,
                )
            }
        }

        return output
    }

    let sharpsAdded = 0
    let flatsAdded = 0

    // Labels a note reduced into the first octave, i.e. 0 to 11 semitones.
    const labelWithinOctave = (fromTonic: number): string => {
        if (fromTonic === 0) {
            return style === "interval" ? "P1" : "1"
        }

        const majorFormulaIndex =
            MAJOR_SCALE_FORMULA_FROM_TONIC.indexOf(fromTonic)

        if (majorFormulaIndex !== -1) {
            return style === "interval"
                ? MAJOR_INTERVAL_LABELS[majorFormulaIndex]
                : `${majorFormulaIndex + 2}`
        }

        for (let j = 0; j < MAJOR_SCALE_FORMULA_FROM_TONIC.length - 1; j++) {
            const prev = j === 0 ? 0 : MAJOR_SCALE_FORMULA_FROM_TONIC[j - 1]
            const current = MAJOR_SCALE_FORMULA_FROM_TONIC[j]

            if (!(prev < fromTonic && fromTonic < current)) {
                continue
            }

            const distanceFromPrev = fromTonic - prev
            const distanceToCurrent = current - fromTonic

            if (distanceFromPrev < distanceToCurrent) {
                sharpsAdded++

                return style === "interval"
                    ? `A${j + 1}`
                    : "#".repeat(distanceFromPrev) +
                    String(MAJOR_SCALE_DEGREE_NUMBERS[j])
            }

            if (distanceFromPrev > distanceToCurrent) {
                flatsAdded++

                return style === "interval"
                    ? loweredIntervalLabel(j + 2)
                    : "b".repeat(distanceToCurrent) +
                    String(MAJOR_SCALE_DEGREE_NUMBERS[j])
            }

            // Equidistant, so use the conventional label
            if (flatsAdded - sharpsAdded > 2) {
                return style === "interval"
                    ? loweredIntervalLabel(j + 2)
                    : `b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`
            }

            if (sharpsAdded - flatsAdded > 2) {
                return style === "interval"
                    ? `A${j + 1}`
                    : `#${MAJOR_SCALE_DEGREE_NUMBERS[j - 1]}`
            }

            const tiebreaker = EQUIDISTANT_DEGREE_LABEL[fromTonic]

            if (!tiebreaker) {
                flatsAdded++

                return style === "interval"
                    ? loweredIntervalLabel(j + 2)
                    : `b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`
            }

            if (tiebreaker[0] === "#") {
                sharpsAdded++
            } else {
                flatsAdded++
            }

            return style === "interval"
                ? EQUIDISTANT_INTERVAL_LABEL[tiebreaker]
                : tiebreaker
        }

        // Every value from 0 to 11 is covered above, so this is only a guard
        return style === "interval" ? "P1" : "1"
    }

    for (let i = 0; i < input.length - 1; i++) {
        const fromTonic = inputFromTonic[i]

        const octaves = Math.min(
            Math.floor(fromTonic / SEMITONES_PER_OCTAVE),
            MAX_OCTAVE_SHIFT,
        )

        const label = labelWithinOctave(fromTonic % SEMITONES_PER_OCTAVE)

        output.push(
            style === "interval"
                ? raiseIntervalByOctaves(label, octaves)
                : label,
        )
    }

    return output
}