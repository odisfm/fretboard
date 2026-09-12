import {useScale} from "../../contexts/scale/useScale.ts";
import {demoScales} from "./demoScales.ts";
import {TONES_FLAT, TONES_SHARP} from "@fretboard/shared/src/consts.ts";
import type {NoteName} from "@fretboard/shared/src/types/scale.ts";
import Button from "../generic/Button.tsx";

export function ScaleDemo() {
    const scaleContext = useScale()
    const tones = scaleContext.accidentalPref === "flats" ? TONES_FLAT : TONES_SHARP

    function setTonic(tonic: NoteName) {
        scaleContext.setScale({
            ...scaleContext.scale,
            tonic
        })
    }

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
                    scaleContext.setScale(demoScales[idx])
                }}
            >
                {demoScales.map((scale, i) => (
                    <option value={i}>{scale.name}</option>
                ))}
            </select>
        </div>
    )
}