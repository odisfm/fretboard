import type {Tuning} from "@fretboard/shared/types/tuning";
import {useMemo} from "react";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {useScale} from "../../contexts/scale/useScale.ts";

export function TuningPreview({tuning, active, onClick}: {
    tuning: Tuning,
    active: boolean,
    onClick: (tuningId: string) => void
}) {
    const scaleContext = useScale()

    const noteNames = useMemo(() => {
        return tuning.strings.map((s) => {
            return midiPitchToNoteName(s, false, scaleContext.accidentalPref || "sharps", true)
        })
    }, [scaleContext.accidentalPref, tuning.strings])

    return (
        <button className={`
                flex flex-col gap-2 items-start p-2 cursor-pointer
                ${!active ? `bg-black hover:bg-neutral-800` : `bg-slate-700`}
                `}
                onClick={() => {
                    onClick(tuning.id)
                }}
        >
            <span className={`rounded-md px-0 py-0`}>{tuning.name}</span>
            <div className={`flex gap-1`}>
                {noteNames.map((note) => {
                    return (
                        <div className={`
                            w-5 h-5 rounded-full flex items-center justify-center 
                            bg-neutral-200 text-black text-sm font-bold
                        `}>
                            {note}
                        </div>
                    )
                })}
            </div>
        </button>
    )
}