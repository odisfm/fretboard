import type {Tuning} from "@fretboard/shared/types/tuning";
import {type Scale, type ScalePosition, type ScaleShape} from "@fretboard/shared/types/scale"
import {allIndicesForNoteName} from "@fretboard/shared/utils/allIndicesForNoteName"
import { v4 as createUuid } from "uuid"

export type GenerateScaleShapesOptions = {
    maxFretSpan?: number,
    minPerString?: number,
    maxPerString?: number,
    minOctaves?: number
}

export type GenerateScaleShapesOptionsConsolidated = {
    maxFretSpan: number,
    minPerString: number,
    maxPerString: number,
    minOctaves: number
}

const defaultOptions: GenerateScaleShapesOptionsConsolidated = {
    maxFretSpan: 4,
    minPerString: 2,
    maxPerString: 3,
    minOctaves: 1
}

function consolidateOptions(userOptions: GenerateScaleShapesOptions): GenerateScaleShapesOptionsConsolidated {
    return {
        maxFretSpan: userOptions?.maxFretSpan !== undefined ? userOptions.maxFretSpan : defaultOptions.maxFretSpan,
        minPerString: userOptions?.minPerString !== undefined ? userOptions.minPerString : defaultOptions.minPerString,
        maxPerString: userOptions?.maxPerString !== undefined ? userOptions.maxPerString : defaultOptions.maxPerString,
        minOctaves: userOptions?.minOctaves !== undefined ? userOptions.minOctaves : defaultOptions.minOctaves,
    } satisfies GenerateScaleShapesOptionsConsolidated
}

export function generateScaleShapes(
    tuning: Tuning,
    scale: Scale,
    userOptions?: GenerateScaleShapesOptions
): ScaleShape[] {
    let finalShapes: ScaleShape[] = []
    const options = consolidateOptions(userOptions || {} as GenerateScaleShapesOptions)
    const noteIndices = allIndicesForNoteName(scale.tonic)
    const stringCount = tuning.strings.length
    let baseShapes: ScaleShape[] = []
    const scaleDegreeCount = scale.intervals.length

    for (let s = 0; s < stringCount; s++) {
        const zeroFret = tuning.strings[s]
        for (let f = 0; f <= tuning.fretCount; f++) {
            const pitch = zeroFret + f
            if (!noteIndices.has(pitch)) {
                continue
            }

            let thisFretScaleShapes: ScaleShape[] = [{
                id: "", // this shape will likely be duplicated, we'll give it an id at the end
                scale,
                shape: [{
                    stringIndex: s,
                    fret: f,
                    scaleIndex: 0
                }],
                tuning,
                lowFret: f,
                highFret: f
            }]

            while (true) {
                const prevShape = thisFretScaleShapes.at(-1)!
                const thisShape: ScaleShape = {
                    ...prevShape,
                    shape: [...prevShape.shape]
                }
                const lastPos = thisShape.shape.at(-1)!
                const thisScaleIndex = (lastPos.scaleIndex + 1) % scaleDegreeCount
                const thisFretJump = scale.intervals[(thisScaleIndex - 1) % scaleDegreeCount]
                const thisFret = lastPos.fret + thisFretJump

                if (thisFret > tuning.fretCount) break
                if (thisFret - prevShape.lowFret > options.maxFretSpan) break

                const thisPos: ScalePosition = {
                    fret: thisFret, scaleIndex: thisScaleIndex, stringIndex: s

                }
                thisShape.shape.push(thisPos)
                thisShape.highFret = thisFret

                thisFretScaleShapes.push(thisShape)

                if (thisFret === tuning.fretCount || thisShape.shape.length === options.maxPerString) break

            }

            thisFretScaleShapes = thisFretScaleShapes.filter(s => {
                return s.shape.length >= options.minPerString
            })

            baseShapes.push(...thisFretScaleShapes)
        }

        for (let t = s + 1; t < stringCount; t++) {
            const zeroFret = tuning.strings[t]
            const nextBaseShapes: ScaleShape[] = []

            for (let b = 0; b < baseShapes.length; b++) {
                const thisShape: ScaleShape = {
                    ...baseShapes[b],
                    shape: baseShapes[b].shape.map(pos => ({ ...pos }))
                }
                const lastPos =  thisShape.shape.at(-1)!
                // perhaps the last position could have been on this string?
                const lastPosValue = tuning.strings[lastPos.stringIndex] + lastPos.fret
                const lastPosToThisFret = (lastPosValue - zeroFret)
                if (
                    lastPos.stringIndex !== t &&
                    lastPosToThisFret >= 0 &&
                    thisShape.highFret - lastPosToThisFret <= options.maxFretSpan &&
                    lastPosToThisFret - thisShape.lowFret <= options.maxFretSpan
                ) {
                    const _shape = [...thisShape.shape]
                    _shape.pop()
                    const shape = [..._shape, {
                        fret: lastPosToThisFret,
                        stringIndex: t,
                        scaleIndex: lastPos.scaleIndex
                    }]
                    const additionalShape: ScaleShape = {...thisShape, shape: shape}
                    let newLowFret = Infinity
                    let newHighFret = -Infinity
                    for (const s of additionalShape.shape) {
                        if (s.fret < newLowFret) newLowFret = s.fret
                        if (s.fret > newHighFret) newHighFret = s.fret
                    }
                    additionalShape.lowFret = newLowFret
                    additionalShape.highFret = newHighFret
                    // we will deal with it later
                    baseShapes.push(additionalShape)
                }

                const thisScaleIndex =
                    (lastPos.scaleIndex + 1) % scaleDegreeCount
                const thisJump = scale.intervals[(thisScaleIndex - 1 + scaleDegreeCount) % scaleDegreeCount]
                const thisVal = tuning.strings[lastPos.stringIndex] + lastPos.fret + thisJump
                const thisFret = thisVal - zeroFret

                if (thisShape.highFret - thisFret > options.maxFretSpan || thisFret - thisShape.lowFret > options.maxFretSpan) {
                    // need to check lowFret too in case this string is tuned higher than the last
                    nextBaseShapes.push(thisShape)
                    continue
                }

                if (thisFret < thisShape.lowFret) thisShape.lowFret = thisFret
                if (thisFret > thisShape.highFret) thisShape.highFret = thisFret

                const shapeAdditions: ScalePosition[] = []

                shapeAdditions.push({
                    scaleIndex: thisScaleIndex,
                    fret: thisFret,
                    stringIndex: t
                })

                while (shapeAdditions.length < options.maxPerString) {
                    const lastPos = shapeAdditions.at(-1)!
                    const thisScaleIndex =
                        (lastPos.scaleIndex + 1) % scaleDegreeCount
                    const thisJump = scale.intervals[(thisScaleIndex - 1 + scaleDegreeCount) % scaleDegreeCount]
                    const thisFret = lastPos.fret + thisJump

                    if (thisFret > tuning.fretCount){
                        break
                    }

                    if (thisShape.highFret - thisFret > options.maxFretSpan || thisFret - thisShape.lowFret > options.maxFretSpan) {
                        break
                    }

                    if (thisFret < thisShape.lowFret) {
                        thisShape.lowFret = thisFret
                    }
                    if (thisFret > thisShape.highFret) {
                        thisShape.highFret = thisFret
                    }

                    shapeAdditions.push({
                        fret: thisFret,
                        scaleIndex: thisScaleIndex,
                        stringIndex: t,
                    })

                }

                if (shapeAdditions.length >= options.minPerString) {
                    thisShape.shape.push(...shapeAdditions)
                }
                nextBaseShapes.push(thisShape)

            }
            baseShapes = nextBaseShapes
        }

        finalShapes.push(...baseShapes)
    }

    // filter shapes not meeting octave requirement
    const octaveRequiredPositions = (scaleDegreeCount * options.minOctaves) + 1
    finalShapes = finalShapes.filter(s => {
        if (options.minOctaves === 0) return true
        return s.shape.length >= octaveRequiredPositions
    })

    const seen = new Set<string>()
    finalShapes = finalShapes.filter(sh => {
        const key = sh.shape.map(p => `${p.stringIndex}:${p.fret}`).join(',')
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })

    finalShapes = finalShapes.map((s) => {
        s.id = createUuid()
        return s
    })

    return finalShapes
}