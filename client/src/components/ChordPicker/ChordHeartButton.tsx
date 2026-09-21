import FavButton from "../generic/FavButton.tsx";
import type {Chord} from "@fretboard/shared/types/chord";
import {useMemo} from "react";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {isSameChord} from "@fretboard/shared/utils/isSameStructure";
import {getChordName} from "@fretboard/shared/utils/getChordName";
import {useChord} from "../../contexts/chord/useChord.ts";

export function ChordHeartButton({chord}: {chord: Chord}) {
    const userDataContext = useUserData()
    const chordContext = useChord()

    const isSaved: boolean = useMemo(() => {
        for (const savedChord of userDataContext.chords) {
            if (isSameChord(chord, savedChord)) return true;
        }
        return false;
    }, [userDataContext.chords, chord])

    function toggleSavedChord() {
        const newChord = {
            ...chord,
            quality: getChordName(
                chordContext.chord.root,
                chord.intervals,
                false,
                false
                    ) || ""
        }
        userDataContext.toggleSavedChord(newChord)
    }


    return (
        <FavButton
            active={isSaved}
            onClick={() => toggleSavedChord()}
            />
    )
}
