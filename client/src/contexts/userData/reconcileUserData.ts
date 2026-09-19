import type {Tuning} from "@fretboard/shared/types/tuning";
import type {ScaleShape, Scale} from "@fretboard/shared/types/scale";

export function reconcileUserData(
    localTunings: Tuning[], remoteTunings: Tuning[],
    localScaleShapes: ScaleShape[], remoteScaleShapes: ScaleShape[],
    localScales: Scale[], remoteScales: Scale[],
    deletedTunings: string[], deletedScaleShapes: string[], deletedScales: string[]
) {
    let reconciledTunings: Tuning[] = [];
    let reconciledScaleShapes: ScaleShape[] = [];
    let reconciledScales: Scale[] = [];

    reconciledTunings = deleteFromList(deletedTunings, remoteTunings) as Tuning[];
    reconciledScaleShapes = deleteFromList(deletedScaleShapes, remoteScaleShapes) as ScaleShape[];
    reconciledScales = deleteFromList(deletedScales, remoteScales) as Scale[]

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

    return {
        reconciledTunings, reconciledScaleShapes, reconciledScales,
    }
}

type IdHaver = {
    id: string;
}

function deleteFromList(deleteList: string[], list: IdHaver[]): IdHaver[] {
    const pruned = [...list];
    for (let i = 0; i < list.length; i++) {
        if (deleteList.includes(list[i].id)) {
            pruned.splice(i, 1);
            i -= 1
        }
    }
    return pruned
}
