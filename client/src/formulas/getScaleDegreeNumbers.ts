import sumToIndex from "@fretboard/shared/src/utils/sumToIndex.ts"

const MAJOR_SCALE_FORMULA = [2, 2, 1, 2, 2, 2, 1]
const MAJOR_SCALE_FORMULA_FROM_TONIC = [2, 4, 5, 7, 9, 11, 12]
const MAJOR_SCALE_DEGREE_NUMBERS = [2, 3, 4, 5, 6, 7, 1]

// Tiebreaker for notes equidistant between two degrees
const EQUIDISTANT_DEGREE_LABEL: Record<number, string> = {
    1:  "b2",
    3:  "b3",
    6:  "b5",
    8:  "#5",
    10: "b7",
}

export default function getScaleDegreeNumbers(input: number[]): string[] {
    const output: string[] = ["1"];
    const inputFromTonic: number[] = input.map((_, i) => sumToIndex(input, i))
    if (input.length === MAJOR_SCALE_FORMULA.length) {
        for (let i = 0; i < input.length - 1; i++) {
            const major = MAJOR_SCALE_FORMULA_FROM_TONIC[i]
            const user = inputFromTonic[i]
            if (user === major) {
                output.push(`${i + 2}`)
            } else if (user < major) {
                output.push(`b${i + 2}`)
            } else if (user > major) {
                output.push(`#${i + 2}`)
            }
        }
    } else {
        let sharpsAdded = 0
        let flatsAdded = 0
        for (let i = 0; i < input.length - 1; i++) {
            const userFromTonic = inputFromTonic[i]
            const majorFormulaIndex = MAJOR_SCALE_FORMULA_FROM_TONIC.indexOf(userFromTonic)
            if (majorFormulaIndex !== -1) {
                output.push(`${majorFormulaIndex + 2}`)
            } else {
                for (let j = 0; j < MAJOR_SCALE_FORMULA_FROM_TONIC.length - 1; j++) {
                    let prev: number
                    const current = MAJOR_SCALE_FORMULA_FROM_TONIC[j]
                    if (j === 0) {
                        prev = 0
                    } else {
                        prev = MAJOR_SCALE_FORMULA_FROM_TONIC[j - 1]
                    }
                    if (!(prev < userFromTonic && userFromTonic < current)) {
                        continue
                    }
                    const distanceFromPrev = userFromTonic - prev
                    const distanceToCurrent = current - userFromTonic

                    if (distanceFromPrev < distanceToCurrent) {
                        output.push("#".repeat(distanceFromPrev) + String(MAJOR_SCALE_DEGREE_NUMBERS[j]))
                        sharpsAdded++
                    } else if (distanceFromPrev > distanceToCurrent) {
                        output.push("b".repeat(distanceToCurrent) + String(MAJOR_SCALE_DEGREE_NUMBERS[j]))
                        flatsAdded--
                    } else {
                        // use conventional label
                        if (flatsAdded - sharpsAdded > 2) {
                            output.push(`b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`)
                        } else if (sharpsAdded - flatsAdded > 2) {
                            output.push(`#${MAJOR_SCALE_DEGREE_NUMBERS[j - 1]}`)
                        } else {
                            const tiebreaker = EQUIDISTANT_DEGREE_LABEL[userFromTonic]
                            if (!tiebreaker) {
                                flatsAdded++
                                output.push(`b${MAJOR_SCALE_DEGREE_NUMBERS[j]}`)
                            } else {
                                if (tiebreaker[0] === "#") {
                                    sharpsAdded++
                                } else {
                                    flatsAdded++
                                }
                                output.push(tiebreaker)
                            }
                        }
                    }
                }
            }
        }
    }

    return output;
}
