import sumToIndex from "@fretboard/shared/src/utils/sumToIndex.ts"

const MAJOR_SCALE_FORMULA = [2, 2, 1, 2, 2, 2, 1]
const MAJOR_SCALE_FORMULA_FROM_TONIC = [2, 4, 5, 7, 9, 11, 12]
const MAJOR_SCALE_DEGREE_NUMBERS = [2, 3, 4, 5, 6, 7, 1]

const MAJOR_INTERVAL_LABELS = ["M2", "M3", "P4", "P5", "M6", "M7", "P8"]

// Tiebreaker for notes equidistant between two degrees
const EQUIDISTANT_DEGREE_LABEL: Record<number, string> = {
    1:  "b2",
    3:  "b3",
    6:  "b5",
    8:  "#5",
    10: "b7",
}

type Style = "nashville" | "interval"

export default function getScaleDegreeNumbers(
    input: number[],
    style: Style = "nashville",
): string[] {
    const output: string[] = [
        style === "interval" ? "P1" : "1",
    ]

    const inputFromTonic: number[] = input.map((_, i) => sumToIndex(input, i))

    if (input.length === MAJOR_SCALE_FORMULA.length) {
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
    } else {
        let sharpsAdded = 0
        let flatsAdded = 0

        for (let i = 0; i < input.length - 1; i++) {
            const userFromTonic = inputFromTonic[i]
            const majorFormulaIndex =
                MAJOR_SCALE_FORMULA_FROM_TONIC.indexOf(userFromTonic)

            if (majorFormulaIndex !== -1) {
                output.push(
                    style === "interval"
                        ? MAJOR_INTERVAL_LABELS[majorFormulaIndex]
                        : `${majorFormulaIndex + 2}`,
                )
            } else {
                for (let j = 0; j < MAJOR_SCALE_FORMULA_FROM_TONIC.length - 1; j++) {
                    let prev: number

                    if (j === 0) {
                        prev = 0
                    } else {
                        prev = MAJOR_SCALE_FORMULA_FROM_TONIC[j - 1]
                    }

                    const current = MAJOR_SCALE_FORMULA_FROM_TONIC[j]

                    if (!(prev < userFromTonic && userFromTonic < current)) {
                        continue
                    }

                    const distanceFromPrev = userFromTonic - prev
                    const distanceToCurrent = current - userFromTonic

                    if (distanceFromPrev < distanceToCurrent) {
                        if (style === "interval") {
                            output.push(`A${j + 1}`)
                        } else {
                            output.push(
                                "#".repeat(distanceFromPrev) +
                                String(MAJOR_SCALE_DEGREE_NUMBERS[j]),
                            )
                        }
                        sharpsAdded++
                    } else if (distanceFromPrev > distanceToCurrent) {
                        if (style === "interval") {
                            output.push(`m${j + 2}`)
                        } else {
                            output.push(
                                "b".repeat(distanceToCurrent) +
                                String(MAJOR_SCALE_DEGREE_NUMBERS[j]),
                            )
                        }
                        flatsAdded--
                    } else {
                        // use conventional label
                        if (flatsAdded - sharpsAdded > 2) {
                            if (style === "interval") {
                                output.push(`m${j + 2}`)
                            } else {
                                output.push(
                                    `b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`,
                                )
                            }
                        } else if (sharpsAdded - flatsAdded > 2) {
                            if (style === "interval") {
                                output.push(`A${j + 1}`)
                            } else {
                                output.push(
                                    `#${MAJOR_SCALE_DEGREE_NUMBERS[j - 1]}`,
                                )
                            }
                        } else {
                            const tiebreaker =
                                EQUIDISTANT_DEGREE_LABEL[userFromTonic]

                            if (!tiebreaker) {
                                flatsAdded++

                                if (style === "interval") {
                                    output.push(`m${j + 2}`)
                                } else {
                                    output.push(
                                        `b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`,
                                    )
                                }
                            } else {
                                if (tiebreaker[0] === "#") {
                                    sharpsAdded++
                                } else {
                                    flatsAdded++
                                }

                                if (style === "interval") {
                                    const intervalMap: Record<string, string> = {
                                        b2: "m2",
                                        b3: "m3",
                                        b5: "d5",
                                        "#5": "A5",
                                        b7: "m7",
                                    }
                                    output.push(intervalMap[tiebreaker])
                                } else {
                                    output.push(tiebreaker)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return output
}