import {useScale} from "../../contexts/scale/useScale.ts";
import {
    TONES_FLAT,
    TONES_SHARP,
    TONES,
    TONES_SHARP_STYLED,
    TONES_FLAT_STYLED,
    TONES_STYLED
} from "@fretboard/shared/consts";
import type {NoteName} from "@fretboard/shared/types/scale";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {ButtonGroup} from "../generic/ButtonGroup.tsx";
import { Bs5CircleFill } from "react-icons/bs";
import { RxFontRoman } from "react-icons/rx";
import { MdMusicNote } from "react-icons/md";
import Tooltip from "../generic/Tooltip.tsx";
import {ScalePreview} from "../ScalePreview/ScalePreview.tsx";
import {ExpandableHeading} from "../ExpandableHeading.tsx";
import {ScaleIntervalGrid} from "./ScaleIntervalGrid.tsx";

export function ScaleDemo() {
    const scaleContext = useScale()
    const userDataContext = useUserData()
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

    function setTonic(tonic: NoteName) {
        scaleContext.setScale({
            ...scaleContext.scale,
            tonic
        })
    }

    function setTonicByIndex(i: number) {
        setTonic(tones[i] as NoteName)
    }

    return (
        <ExpandableHeading
            heading={"Scale"}
            collapsedHeading={`Scale | ${scaleContext.scale.tonic} ${scaleContext.scale.name}`}
            expanded={userDataContext.prefs.moduleVisibility.scale}
            onToggle={() => userDataContext.setPrefs({
                ...userDataContext.prefs,
                moduleVisibility: {
                    ...userDataContext.prefs.moduleVisibility,
                    scale: !userDataContext.prefs.moduleVisibility.scale
                }
            })}
        >
            <div className={`flex sm:flex-wrap md:flex-nowrap self-start gap-8 bg-neutral-900 rounded-md p-4 min-w-0 w-min`}>
                <div className={`flex flex-col h-60 w-70 overflow-y-scroll overflow-x-clip rounded-lg`}>
                    {userDataContext.scales.map((scale) => {
                        return (
                            <ScalePreview
                                scale={{...scale, tonic: scaleContext.scale.tonic}}
                                active={scale.id === scaleContext.scale.id}
                            />
                        )
                    })}
                </div>
                <div className={`flex flex-col gap-4 min-w-0 rounded-lg overflow-hidden`}>
                    <h2 className={`text-3xl font-bold`}>
                        {`${scaleContext.scale.tonic} ${scaleContext.scale.name}`}
                    </h2>
                    <ScaleIntervalGrid scale={scaleContext.scale} />
                    <div className={`overflow-x-scroll min-w-0 mt-auto`}>
                        <ButtonGroup
                            onClick={setTonicByIndex}
                            _children={tonesStyled.map(((ts) => {
                                return (
                                    <span>{ts}</span>
                                )
                            }))}
                            active={tones.indexOf(scaleContext.scale.tonic)}
                            styles={`w-10`}
                        />
                    </div>
                    <div className={`flex flex-wrap gap-4 items-center mb-4`}>
                        <div className={`flex gap-1 justify-center mr-2`}>
                            <ButtonGroup
                                _children={["♭", "♮", "♯"].map(((symbol) => {
                                    return (<span>{symbol}</span>)
                                }))}
                                onClick={(i) => {
                                    switch (i) {
                                        case 0:
                                            scaleContext.setAccidentalPref("flats")
                                            break;
                                        case 1:
                                            scaleContext.setAccidentalPref(null)
                                            break;
                                        case 2:
                                            scaleContext.setAccidentalPref("sharps")
                                    }
                                }}
                                active={["flats", null, "sharps"].indexOf(scaleContext.accidentalPref)}
                                styles={"w-10 h-7"}
                            />
                            <Tooltip tooltipStyles={`bg-neutral-950`} children={
                                <>
                                    <span className={`font-bold mb-2 block`}>Accidentals</span>
                                    <ul className={`[&_li]:flex [&_li]:items-center [&_li]:gap-1`}>
                                        <li>♭ prefer flats</li>
                                        <li>♮ no preference</li>
                                        <li>♯ prefer sharps</li>
                                    </ul>
                                </>
                            }/>
                        </div>
                        <div className={`flex gap-1 justify-center mr-2`}>
                            <ButtonGroup
                                _children={[
                                    <Bs5CircleFill/>,
                                    <MdMusicNote/>,
                                    <RxFontRoman/>,
                                ]}
                                onClick={(i) => {
                                    switch (i) {
                                        case 0:
                                            scaleContext.setIntervalPref("nashville")
                                            break;
                                        case 1:
                                            scaleContext.setIntervalPref("note")
                                            break;
                                        case 2:
                                            scaleContext.setIntervalPref("interval")
                                            break;
                                    }
                                }}
                                active={["nashville", "note", "interval"].indexOf(scaleContext.intervalPref)}
                                styles={`w-10 h-7`}
                            />
                            <Tooltip tooltipStyles={`bg-neutral-950`} children={
                                <div className={`flex flex-col gap-1`}>
                                    <span className={`font-bold mb-2 block`}>Note labels</span>
                                    <ul className={`[&_li]:flex [&_li]:items-center [&_li]:gap-1`}>
                                        <li><Bs5CircleFill/> Nashville</li>
                                        <li><MdMusicNote/> Letter</li>
                                        <li><RxFontRoman/>Interval</li>
                                    </ul>
                                </div>
                            }/>
                        </div>

                    </div>
                </div>
            </div>
        </ExpandableHeading>
    )
}
