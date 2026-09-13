import {useScale} from "../../contexts/scale/useScale.ts";
import {TONES_FLAT, TONES_SHARP, TONES} from "@fretboard/shared/src/consts.ts";
import type {NoteName} from "@fretboard/shared/src/types/scale.ts";
import Button from "../generic/Button.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";

export function ScaleDemo() {
    const scaleContext = useScale()
    const userDataContext = useUserData()
    let tones: string[]
    switch(scaleContext.accidentalPref) {
        case "sharps":
            tones = TONES_SHARP
            break;
        case "flats":
            tones = TONES_FLAT
            break;
        case null:
            tones = TONES
            break;
    }

    function setTonic(tonic: NoteName) {
        scaleContext.setScale({
            ...scaleContext.scale,
            tonic
        })
    }

    const buttonGroupStyles = `bg-black rounded-md p-[0.5] self-start`
    const buttonStyles = `px-4`

    return (
        <div className={`flex flex-col gap-2 bg-neutral-900 rounded-md p-4`}>
            <div className={`w-xs flex flex-wrap gap-1`}>
                {tones.map((t) => {
                    return (
                        <Button
                            onClick={() => {
                                setTonic(t as NoteName)
                            }}
                            variant={scaleContext.scale.tonic === t ? "default" : "subtle"}
                        >
                            {t}
                        </Button>
                    )
                })}
            </div>
            <select
                className={`self-start bg-black px-2 py-1 rounded-md`}
                onChange={(e) => {
                    const idx = Number(e.target.value);
                    scaleContext.setScale(userDataContext.scales[idx])
                }}
            >
                {userDataContext.scales.map((scale, i) => (
                    <option value={i}>{scale.name}</option>
                ))}
            </select>
            <div
                className={`flex ${buttonGroupStyles}`}
            >
                <Button
                    onClick={() => {scaleContext.setAccidentalPref("flats")}}
                    variant={scaleContext.accidentalPref === "flats" ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    ♭
                </Button>
                <Button
                    onClick={() => {scaleContext.setAccidentalPref(null)}}
                    variant={scaleContext.accidentalPref === null ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    ♭|♯
                </Button>
                <Button
                    onClick={() => {scaleContext.setAccidentalPref("sharps")}}
                    variant={scaleContext.accidentalPref === "sharps" ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    ♯
                </Button>
            </div>
            <div
                className={`flex ${buttonGroupStyles}`}
            >
                <Button
                    onClick={() => {scaleContext.setIntervalPref("nashville")}}
                    variant={scaleContext.intervalPref === "nashville" ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    ♮
                </Button>
                <Button
                    onClick={() => {scaleContext.setIntervalPref(null)}}
                    variant={scaleContext.intervalPref === null ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    ♪
                </Button>
                <Button
                    onClick={() => {scaleContext.setIntervalPref("interval")}}
                    variant={scaleContext.intervalPref === "interval" ? "default" : "subtle"}
                    styles={buttonStyles}
                >
                    I
                </Button>
            </div>
        </div>
    )
}