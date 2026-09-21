import FavButton from "../generic/FavButton.tsx";
import type {Chord} from "@fretboard/shared/types/chord";
import {useMemo} from "react";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {isSameChord} from "@fretboard/shared/utils/isSameStructure";

export function ChordHeartButton({chord}: {chord: Chord}) {
    const userDataContext = useUserData()

    const isSaved: boolean = useMemo(() => {
        for (const savedChord of userDataContext.chords) {
            if (isSameChord(chord, savedChord)) return true;
        }
        return false;
    }, [userDataContext.chords, chord])


    return (
        <FavButton
            active={isSaved}
            onClick={() => userDataContext.toggleSavedChord(chord)}
            />
    )
}
