import type {Barre, Chord, ChordPosition, ChordShape, Finger} from "@fretboard/shared/types/chord";
import type {Tuning} from "@fretboard/shared/types/tuning";
import {allIndicesForNoteName} from "@fretboard/shared/utils/allIndicesForNoteName";
import {v4 as uuid} from "uuid";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import type {NoteName} from "@fretboard/shared/types/scale";

export type generateChordShapesOptions = {
    omissions: number[],
    openStrings: boolean,
    barres: boolean,
    fingers: number,
    fretSpan: number,
    rootIsBass: true,
    lowFret: number,
    highFret: number,
}

const FINGERS: readonly Finger[] = [1, 2, 3, 4]

export type Fingering = {
    fingers: number
    barre: Barre | null
}

export type FingeringResult =
    | { ok: true, fingering: Fingering }
    | { ok: false, reason: "tooManyFingers" | "barreBlocked" }

/** Working state during the search. Kept separate from ChordShape so we don't
 *  clone the chord/tuning refs at every node, and so the fret span can be
 *  tracked over fretted notes only. */
type PartialShape = {
    positions: ChordPosition[]
    /** Span of *fretted* notes only; open strings need no finger and no reach. */
    frettedLow: number
    frettedHigh: number
}

/**
 * Works out whether a set of positions can actually be held, and how.
 *
 * The barre model is deliberately narrow: at most one barre, taken by the
 * index finger at the lowest fretted fret, with every other finger above it.
 * That covers the overwhelming majority of real barre shapes and, crucially,
 * lets us enforce the physical consequence of laying a finger flat: every
 * string it lies across sounds at the barre fret or higher. A muted or open
 * string inside the span is impossible.
 *
 * `reason` matters for search pruning:
 *  - "tooManyFingers" is monotonic (adding notes can never reduce the finger
 *    requirement), so the branch is dead and can be cut.
 *  - "barreBlocked" is not: a note added later on a lower fret moves the barre
 *    down and the blocked span stops being a barre at all. Keep searching.
 */
export function planFingering(
    positions: ChordPosition[],
    options: generateChordShapesOptions
): FingeringResult {
    // A hand has four fretting fingers however generous the option is.
    const budget = Math.min(options.fingers, FINGERS.length)

    const fretted = positions.filter(p => p.fret > 0)

    // Enough fingers to take every note on its own, so no barre is involved
    // and interior muted strings are the player's problem, not a contradiction.
    if (fretted.length <= budget) {
        return {ok: true, fingering: {fingers: fretted.length, barre: null}}
    }

    if (!options.barres) {
        return {ok: false, reason: "tooManyFingers"}
    }

    let barreFret = Infinity
    for (const p of fretted) {
        if (p.fret < barreFret) barreFret = p.fret
    }

    const onBarreFret = fretted.filter(p => p.fret === barreFret)
    if (onBarreFret.length < 2) {
        // Nothing to gain: a "barre" over a single string is just a finger.
        return {ok: false, reason: "tooManyFingers"}
    }

    const fingers = 1 + (fretted.length - onBarreFret.length)
    if (fingers > budget) {
        return {ok: false, reason: "tooManyFingers"}
    }

    let fromString = Infinity
    let toString = -Infinity
    for (const p of onBarreFret) {
        if (p.stringIndex < fromString) fromString = p.stringIndex
        if (p.stringIndex > toString) toString = p.stringIndex
    }

    const fretByString = new Map<number, number>()
    for (const p of positions) {
        fretByString.set(p.stringIndex, p.fret)
    }

    // The finger is physically lying on these strings. Each one must be played,
    // and played at or above the barre fret.
    for (let s = fromString; s <= toString; s++) {
        const fret = fretByString.get(s)
        if (fret === undefined) return {ok: false, reason: "barreBlocked"}  // dead string under the barre
        if (fret < barreFret) return {ok: false, reason: "barreBlocked"}    // incl. open strings
    }

    return {
        ok: true,
        fingering: {
            fingers,
            barre: {finger: 1, fret: barreFret, fromString, toString},
        },
    }
}

/**
 * Labels each fretted position with the finger that takes it.
 *
 * Fingers are handed out in (fret, stringIndex) order, which is the
 * non-crossing assignment: a higher-numbered finger is never behind a
 * lower-numbered one, and at a shared fret the lower finger sits on the lower
 * string. That reproduces the textbook fingerings for the open shapes and for
 * E/A-shape barres. The barre, when there is one, takes finger 1 across every
 * position sitting on its fret.
 *
 * Exported so the UI can re-run it after a shape is hand-edited, since a
 * stored finger/barre pair goes stale the moment a note moves.
 */
export function assignFingers(positions: ChordPosition[], fingering: Fingering): ChordPosition[] {
    const {barre} = fingering
    const fingerByString = new Map<number, Finger>()

    const fretted = positions.filter(p => p.fret > 0)

    if (barre) {
        for (const p of fretted) {
            if (p.fret === barre.fret) fingerByString.set(p.stringIndex, barre.finger)
        }
    }

    const free = fretted
        .filter(p => !fingerByString.has(p.stringIndex))
        .sort((a, b) => a.fret - b.fret || a.stringIndex - b.stringIndex)

    let next = barre ? 1 : 0
    for (const p of free) {
        const finger = FINGERS[next++]
        if (finger === undefined) break
        fingerByString.set(p.stringIndex, finger)
    }

    return positions.map(p => {
        const finger = fingerByString.get(p.stringIndex)
        return finger === undefined ? p : {...p, finger}
    })
}

export function generateChordShapes(
    chord: Chord,
    tuning: Tuning,
    options: generateChordShapesOptions
): ChordShape[] {
    const rootIndices = allIndicesForNoteName(chord.root)
    const rootPitchClass = indexForNoteName(chord.root)

    // Absolute pitch -> tone index, and by the same token the set of pitches
    // the search may place at all. The root is seeded first: `intervals` is
    // measured from an assumed 0, so it never spells the root itself, but the
    // root can be voiced on any string, not only under the bass. It always
    // carries index 0, and an interval landing back on it (an octave, say)
    // doesn't reclaim the slot.
    const toneIndexByPitch = new Map<number, number>()

    for (const idx of rootIndices) {
        toneIndexByPitch.set(idx, 0)
    }

    chord.intervals.forEach((interval, i) => {
        const basePitch = (rootPitchClass + interval) % 12
        const noteName = midiPitchToNoteName(basePitch, false) as NoteName
        for (const idx of allIndicesForNoteName(noteName)) {
            if (!toneIndexByPitch.has(idx)) toneIndexByPitch.set(idx, i + 1)
        }
    })

    // Degrees measured from the root, not absolute pitch classes.
    const requiredDegrees = chord.intervals
        .filter(i => !options.omissions.includes(i))
        .map(i => ((i % 12) + 12) % 12)

    function coversRequiredDegrees(positions: ChordPosition[]): boolean {
        const degrees = new Set<number>()
        for (const p of positions) {
            const pitch = tuning.strings[p.stringIndex] + p.fret
            degrees.add((((pitch - rootPitchClass) % 12) + 12) % 12)
        }

        for (const d of requiredDegrees) {
            if (!degrees.has(d)) return false
        }

        return true
    }

    const bases: PartialShape[] = []

    for (let s = 0; s < tuning.strings.length; s++) {
        const zeroFret = tuning.strings[s]

        // Bases are root positions by construction, hence toneIndex 0.
        if (options.openStrings && rootIndices.has(zeroFret)) {
            bases.push({
                positions: [{stringIndex: s, fret: 0, toneIndex: 0}],
                frettedLow: Infinity,
                frettedHigh: -Infinity,
            })
        }

        const fretStart = Math.max(1, options.lowFret)
        const fretEnd = Math.min(tuning.fretCount, options.highFret)

        for (let f = fretStart; f <= fretEnd; f++) {
            if (!rootIndices.has(zeroFret + f)) continue

            bases.push({
                positions: [{stringIndex: s, fret: f, toneIndex: 0}],
                frettedLow: f,
                frettedHigh: f,
            })
        }
    }

    const shapes: ChordShape[] = []

    function emit(partial: PartialShape) {
        if (!coversRequiredDegrees(partial.positions)) return

        const plan = planFingering(partial.positions, options)
        if (!plan.ok) return

        let lowFret = Infinity
        let highFret = -Infinity
        for (const p of partial.positions) {
            if (p.fret < lowFret) lowFret = p.fret
            if (p.fret > highFret) highFret = p.fret
        }

        shapes.push({
            id: uuid(),
            chord,
            tuning,
            shape: assignFingers(partial.positions, plan.fingering),
            barres: plan.fingering.barre ? [plan.fingering.barre] : [],
            lowFret,
            highFret,
        })
    }

    function extendShape(partial: PartialShape, stringIndex: number) {
        if (stringIndex >= tuning.strings.length) {
            emit(partial)
            return
        }

        const zeroFret = tuning.strings[stringIndex]
        const openToneIndex = toneIndexByPitch.get(zeroFret)

        if (options.openStrings && openToneIndex !== undefined) {
            extendShape(
                {
                    ...partial,
                    positions: [
                        ...partial.positions,
                        {stringIndex, fret: 0, toneIndex: openToneIndex},
                    ],
                },
                stringIndex + 1
            )
        }

        // ±Infinity sentinels mean "no fretted notes yet", so an all-open
        // prefix doesn't pin the reachable window to the nut.
        const searchStart = Math.max(1, options.lowFret, partial.frettedHigh - options.fretSpan + 1)
        const searchEnd = Math.min(tuning.fretCount, options.highFret, partial.frettedLow + options.fretSpan - 1)

        for (let f = searchStart; f <= searchEnd; f++) {
            const toneIndex = toneIndexByPitch.get(zeroFret + f)
            if (toneIndex === undefined) continue

            const positions = [...partial.positions, {stringIndex, fret: f, toneIndex}]

            const plan = planFingering(positions, options)
            if (!plan.ok && plan.reason === "tooManyFingers") continue

            extendShape(
                {
                    positions,
                    frettedLow: Math.min(f, partial.frettedLow),
                    frettedHigh: Math.max(f, partial.frettedHigh),
                },
                stringIndex + 1
            )
        }

        // Always offer muting this string outright — either because no
        // playable note exists here, or as a deliberate voicing choice
        // even when a valid one does.
        extendShape(partial, stringIndex + 1)
    }

    for (const base of bases) {
        extendShape(base, base.positions[0].stringIndex + 1)
    }

    return shapes
}
