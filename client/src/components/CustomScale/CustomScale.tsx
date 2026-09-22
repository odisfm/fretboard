import {useMemo, useState} from "react";
import {useScale} from "../../contexts/scale/useScale.ts";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import type {NoteName, Scale} from "@fretboard/shared/types/scale";
import {ButtonGroup} from "../generic/ButtonGroup.tsx";
import {
    TONES,
    TONES_FLAT,
    TONES_FLAT_STYLED,
    TONES_SHARP,
    TONES_SHARP_STYLED,
    TONES_STYLED
} from "@fretboard/shared/consts";
import {styleNoteName} from "@fretboard/shared/utils/styleNoteName";
import {ScalePreview} from "../ScalePreview/ScalePreview.tsx";
import {v4 as createUuid} from "uuid";
import Button from "../generic/Button.tsx";
import {useNavigate} from "react-router";

export function CustomScale() {
    const userDataContext = useUserData();
    const scaleContext = useScale()
    const [tonic, setTonic] = useState<NoteName>(scaleContext.scale.tonic)
    const [activeIntervals, setActiveIntervals] = useState<boolean[]>(
        [false, false, false, false, false, false, false, false, false, false, false]
    )
    const [scaleName, setScaleName] = useState<string>("");
    const navigate = useNavigate()
    let tones: string[]
    let tonesStyled: string[]
    switch(scaleContext.accidentalPref) {
        case "sharps":
            tones = TONES_SHARP
            tonesStyled = TONES_SHARP_STYLED
            break;
        case "flats":
            tones = TONES_FLAT
            tonesStyled = TONES_FLAT_STYLED
            break;
        case null:
            tones = TONES
            tonesStyled = TONES_STYLED
            break;
    }

    const scaleIntervals: number[] = useMemo(() => {
        const intervals: number[] = []
        let runningGap = 0
        for (const b of activeIntervals) {
            runningGap++
            if (b) {
                intervals.push(runningGap)
                runningGap = 0
            }
        }
        if (!intervals.length) return []

        const sum = intervals.reduce((prev, current) =>  prev + current)
        if (sum < 12) {
            intervals.push(12 - sum)
        }

        return intervals
    }, [activeIntervals])

    const scaleId = useMemo(() => createUuid(), [])

    const scale: Scale = useMemo(() => {
        return {
            id: scaleId,
            tonic: tonic,
            intervals: scaleIntervals,
            name: scaleName || "custom",
            order: ""
        }
    }, [scaleName, scaleIntervals, scaleId, tonic])

    const canSubmit = Boolean(
        scaleIntervals.length &&
        scaleName
    )

    return (
        <div className={`flex flex-col items-center gap-4`}>
            <h1 className={`font-bold text-2xl`}>Add custom scale</h1>

            <ButtonGroup
                onClick={(i) => {
                    setTonic(tones[i] as NoteName)
                }}
                _children={tonesStyled}
                active={tones.indexOf(tonic)}
                />

            <span className={`text-sm font-light`}>Scale will be available on any tonic.</span>

            <div className={`flex items-center gap-2 text-xl mt-6`}>
                <h3>{styleNoteName(tonic)}</h3>
                <input
                    placeholder={"enter scale name"}
                    className={`py-4 px-2 bg-black rounded-md`}
                    onChange={(e) => {setScaleName(e.target.value)}}
                />
            </div>

            <ButtonGroup
                actives={activeIntervals}
                onClick={(i) => {
                    setActiveIntervals(prev => prev.with(i, !prev[i]))

                }}
                _children={["m2", "M2", "m3", "M3", "P4", "D5", "P5", "m6", "M6", "m7", "M7"]}
            />

            <div className={"pointer-events-none"}><ScalePreview scale={scale} active={false}/></div>

            <ul className={`flex flex-col gap-2 list-disc`}>
                {scaleIntervals.length === 0 && <li>Add at least one interval</li>}
                {scaleName.length === 0 && <li>Enter a name for your scale</li>}
            </ul>

            <Button
                variant={canSubmit ? "default" : "subtle"}
                disabled={!canSubmit}
                onClick={() => {
                    userDataContext.addScale(scale)
                    scaleContext.setScale(scale)
                    navigate("/scale")
                }}
            >
                Create scale
            </Button>
        </div>
    )
}