import type {Tuning} from "@fretboard/shared/types/tuning";
import type {ScaleShape, Scale} from "@fretboard/shared/types/scale";

export function reconcileUserData(
    localTunings: Tuning[], remoteTunings: Tuning[],
    localShapes: ScaleShape[], remoteShapes: ScaleShape[],
    localScales: Scale[], remoteScales: Scale[],
    deletedTunings: string[], deletedShapes: string[], deletedScales: string[]
) {
    let reconciledTunings: Tuning[] = [];
    let reconciledShapes: ScaleShape[] = [];
    let reconciledScales: Scale[] = [];

    reconciledTunings = deleteFromList(deletedTunings, remoteTunings) as Tuning[];
    reconciledShapes = deleteFromList(deletedShapes, remoteShapes) as ScaleShape[];
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

    for (const ls of localShapes) {
        const idx = reconciledShapes.findIndex((s) => s.id === ls.id)
        if (idx === -1) {
            reconciledShapes.push(ls)
        } else {
            if (ls.updatedAt! > reconciledTunings[idx].updatedAt!) {
                reconciledShapes[idx] = ls
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
        reconciledTunings, reconciledShapes, reconciledScales,
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
