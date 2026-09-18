import {eStandardTuning} from "@fretboard/shared/types/tuning";
import type {Chord} from "@fretboard/shared/types/chord";
import {generateChordShapes} from "./generateChordShapes.tsx";


const chordDef: Chord = {
    id: "",
    intervals: [4, 7, 11],
    root: "C",
    quality: ""
}

const shapes = generateChordShapes(chordDef, eStandardTuning, {
    omissions: [],
    fretSpan: 3,
    barres: true,
    rootIsBass: true,
    openStrings: true,
    fingers: 4,
    lowFret: 0,
    highFret: 24
})

let count = 0
for (const shape of shapes) {
    let string = ""
    for (let i = 0; i < shape.tuning.strings.length; i++) {
        let drewFinger = false
        for (const pos of shape.shape) {
            if (pos.stringIndex === i) {
                string += pos.fret + " "
                drewFinger = true
                break
            }
        }
        if (!drewFinger) {
            string += "X "
        }
    }
    count += 1
    console.log(`#${count}\n\n\n${string}\n\n\n`)
}
