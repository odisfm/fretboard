import type {NoteName} from "../types/scale";

export function styleNoteName(noteName: NoteName): string {
    let newName = noteName as string
    newName = newName.replace("#", "♯")
    newName = newName.replace("b", "♭")
    return newName;
}
