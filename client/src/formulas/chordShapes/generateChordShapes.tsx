import type {Barre, Chord, ChordPosition, ChordShape, Finger} from "@fretboard/shared/types/chord";
import type {Tuning} from "@fretboard/shared/types/tuning";
import {allIndicesForNoteName} from "@fretboard/shared/utils/allIndicesForNoteName";
import {v4 as uuid} from "uuid";

export const MINIMUM_FINGERS = 1
export const MAXIMUM_FINGERS = 4
export const MINIMUM_FRET_SPAN = 0
export const MAXIMUM_FRET_SPAN = 10


export type GenerateChordShapeOptions = {
    omissions: number[],
    openStrings: boolean,
    barres: boolean,
    fingers: number,
    fretSpan: number,
    rootIsBass: true,
    lowFret: number,
    highFret: number,
}

export const defaultGenerateChordShapeOptions: GenerateChordShapeOptions = {
    omissions: [],
    openStrings: false,
    barres: true,
    fingers: 4,
    fretSpan: 3,
    rootIsBass: true,
    lowFret: 0,
    highFret: 24,
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
    /** Absolute pitch of the root this shape was seeded from. Every tone is
     *  identified by its distance above this, so the octave a note lands in is
     *  part of its identity rather than being thrown away. */
    rootPitch: number
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
    options: GenerateChordShapeOptions
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
    options: GenerateChordShapeOptions
): ChordShape[] {
    const rootIndices = allIndicesForNoteName(chord.root)

    // Distance above the voiced root -> tone index, and by the same token the
    // set of placements the search may make at all.
    //
    // Distances, not pitch classes: an interval is only satisfied at a distance
    // congruent to it *and no lower than it*, so a 13 (21) is voiced at 21 or 33
    // semitones and never at 9, where it would simply be a 6. Sub-octave
    // intervals are untouched by the extra condition, since the smallest
    // non-negative distance congruent to them is the interval itself — a 3rd can
    // still sit 4 or 16 semitones up.
    //
    // The root is seeded first: `intervals` is measured from an assumed 0, so it
    // never spells the root itself, but the root can be voiced on any string
    // above the bass. It always carries index 0, and an interval landing back on
    // it (an octave, say) doesn't reclaim the slot. Negative distances are absent
    // by construction, which is what holds the root in the bass.
    const lowestPitch = Math.min(...tuning.strings)
    const highestPitch = Math.max(...tuning.strings) + tuning.fretCount
    const maxDistance = highestPitch - lowestPitch

    const toneIndexByDistance = new Map<number, number>()

    for (let d = 0; d <= maxDistance; d += 12) {
        toneIndexByDistance.set(d, 0)
    }

    chord.intervals.forEach((interval, i) => {
        for (let d = interval; d <= maxDistance; d += 12) {
            if (!toneIndexByDistance.has(d)) toneIndexByDistance.set(d, i + 1)
        }
    })

    // Kept as written, not folded into an octave: a required 13 is only covered
    // by a note an octave-and-a-sixth or more above the root.
    const requiredIntervals = chord.intervals.filter(i => !options.omissions.includes(i))

    function coversRequiredIntervals(positions: ChordPosition[], rootPitch: number): boolean {
        for (const interval of requiredIntervals) {
            const covered = positions.some(p => {
                const distance = tuning.strings[p.stringIndex] + p.fret - rootPitch
                return distance >= interval && (distance - interval) % 12 === 0
            })

            if (!covered) return false
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
                rootPitch: zeroFret,
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
                rootPitch: zeroFret + f,
                frettedLow: f,
                frettedHigh: f,
            })
        }
    }

    const shapes: ChordShape[] = []

    function emit(partial: PartialShape) {
        if (!coversRequiredIntervals(partial.positions, partial.rootPitch)) return

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
        const openToneIndex = toneIndexByDistance.get(zeroFret - partial.rootPitch)

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
            const toneIndex = toneIndexByDistance.get(zeroFret + f - partial.rootPitch)
            if (toneIndex === undefined) continue

            const positions = [...partial.positions, {stringIndex, fret: f, toneIndex}]

            const plan = planFingering(positions, options)
            if (!plan.ok && plan.reason === "tooManyFingers") continue

            extendShape(
                {
                    positions,
                    rootPitch: partial.rootPitch,
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