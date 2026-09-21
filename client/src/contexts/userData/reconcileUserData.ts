import type {Tuning} from "@fretboard/shared/types/tuning";
import type {ScaleShape, Scale} from "@fretboard/shared/types/scale";
import type {ChordShape, Chord} from "@fretboard/shared/types/chord";


export function reconcileUserData(
    localTunings: Tuning[], remoteTunings: Tuning[],
    localScaleShapes: ScaleShape[], remoteScaleShapes: ScaleShape[],
    localScales: Scale[], remoteScales: Scale[],
    localChords: Chord[], remoteChords: Chord[],
    localChordShapes: ChordShape[], remoteChordShapes: ChordShape[],
    deletedTunings: string[],
    deletedScaleShapes: string[],
    deletedScales: string[],
    deletedChords: string[],
    deletedChordShapes: string[],
) {
    let reconciledTunings: Tuning[] = [];
    let reconciledScaleShapes: ScaleShape[] = [];
    let reconciledScales: Scale[] = [];
    let reconciledChords: Chord[] = [];
    let reconciledChordShapes: ChordShape[] = [];

    reconciledTunings = deleteFromList(deletedTunings, remoteTunings) as Tuning[];
    reconciledScaleShapes = deleteFromList(deletedScaleShapes, remoteScaleShapes) as ScaleShape[];
    reconciledScales = deleteFromList(deletedScales, remoteScales) as Scale[]
    reconciledChords = deleteFromList(deletedChords, remoteChords) as Chord[];
    reconciledChordShapes = deleteFromList(deletedChordShapes, remoteChordShapes) as ChordShape[];

    for (const lt of localTunings) {
        const idx = reconciledTunings.findIndex((t) => t.id === lt.id)
        if (idx === -1) {
            reconciledTunings.push(lt);
        } else {
            if (lt.updatedAt! > reconciledTunings[idx].updatedAt!) {
                reconciledTunings[idx] = lt
            }
        }
    }

    for (const ls of localScaleShapes) {
        const idx = reconciledScaleShapes.findIndex((s) => s.id === ls.id)
        if (idx === -1) {
            reconciledScaleShapes.push(ls)
        } else {
            if (ls.updatedAt! > reconciledTunings[idx].updatedAt!) {
                reconciledScaleShapes[idx] = ls
            }
        }
    }

    for (const ls of localScales) {
        const idx = reconciledScales.findIndex((s) => s.id === ls.id)
        if (idx === -1) {
            reconciledScales.push(ls)
        } else {
            if (ls.updatedAt! > reconciledScales[idx].updatedAt!) {
                reconciledScales[idx] = ls
            }
        }
    }

    for (const lc of localChords) {
        const idx = reconciledChords.findIndex((c) => c.id === lc.id)
        if (idx === -1) {
            reconciledChords.push(lc)
        }
    }

    for (const ls of localChordShapes) {
        const idx = reconciledChordShapes.findIndex((s) => s.id === ls.id)
        if (idx === -1) {
            reconciledChordShapes.push(ls)
        } else {
            if (ls.updatedAt! > reconciledScales[idx].updatedAt!) {
                reconciledChordShapes[idx] = ls
            }
        }
    }

    return {
        reconciledTunings, reconciledScaleShapes, reconciledScales, reconciledChords, reconciledChordShapes
    }
}

type IdHaver = {
    id: string;
}

function deleteFromList<T extends IdHaver>(deleteList: string[], list: T[]): T[] {
    const toDelete = new Set(deleteList);
    return list.filter(item => !toDelete.has(item.id));
}
