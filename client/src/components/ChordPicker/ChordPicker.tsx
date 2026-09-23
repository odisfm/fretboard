import {
    TONES,
    TONES_FLAT,
    TONES_FLAT_STYLED,
    TONES_SHARP,
    TONES_SHARP_STYLED,
    TONES_STYLED
} from "@fretboard/shared/consts";
import {useChord} from "../../contexts/chord/useChord.ts";
import type {NoteName} from "@fretboard/shared/types/scale";
import {ButtonGroup} from "../generic/ButtonGroup.tsx";
import {getChordName} from "@fretboard/shared/utils/getChordName";
import {useMemo, useRef, useState} from "react";
import type { ChordPickerOptions } from "../../ChordDemo.tsx";
import Tooltip from "../generic/Tooltip.tsx";
import Button from "../generic/Button.tsx";
import {FaHandPaper, FaSearch} from "react-icons/fa";
import {MdMusicNote} from "react-icons/md";
import {RxFontRoman} from "react-icons/rx";
import {getChordFromName} from "@fretboard/shared/utils/getChordFromName";
import {getChordPickerOptionsFromChord} from "../../formulas/chordShapes/getChordPickerOptionsFromChord.ts";
import { ExpandableHeading } from "../ExpandableHeading.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {ChordHeartButton} from "./ChordHeartButton.tsx";
import {ChordPreview} from "./ChordPreview.tsx";
import {styleNoteName} from "@fretboard/shared/utils/styleNoteName";

export function ChordPicker({chordPickerOptions, setChordPickerOptions}: {
    chordPickerOptions: ChordPickerOptions,
    setChordPickerOptions: (value: ChordPickerOptions) => void
}) {
    const chordContext = useChord();
    let tones: string[]
    let tonesStyled: string[]
    const chordNameSearchRef = useRef<HTMLInputElement | null>(null);
    const [badChordNameSearch, setBadChordNameSearch] = useState(false)
    const userDataContext = useUserData()

    switch(chordContext.accidentalPref) {
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

    function setRootByIndex(index: number){
        let tone: string
        switch(chordContext.accidentalPref) {
            case "sharps":
                tone = TONES_SHARP[index]
                break;
            case "flats":
                tone = TONES_FLAT[index]
                break;
            case null:
                tone = TONES[index]
                break
        }
        chordContext.setChord({
            ...chordContext.chord,
            root: tone as NoteName,
        })
    }

    switch(chordContext.accidentalPref) {
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

    const chordName = useMemo(() => {
        const base = getChordName(chordContext.chord.root, chordContext.chord.intervals)
        if (!base) return "?"
        return styleNoteName(base as NoteName)
    }, [chordContext.chord])

    function setChordByName() {
        if (!chordNameSearchRef.current) return
        const value = chordNameSearchRef.current.value
        const chord = getChordFromName(value)
        if (!chord) {
            setBadChordNameSearch(true)
            chordNameSearchRef.current.blur()
            return;
        }
        setBadChordNameSearch(false)
        chordContext.setChord(chord)
        const options = getChordPickerOptionsFromChord(chord)
        setChordPickerOptions(options)
    }


    return (
        <ExpandableHeading
            heading={"Chord"}
            collapsedHeading={`Chord | ${chordName}`}
            expanded={userDataContext.prefs.moduleVisibility.chord}
            onToggle={() => userDataContext.setPrefs({
                ...userDataContext.prefs,
                moduleVisibility: {
                    ...userDataContext.prefs.moduleVisibility,
                    chord: !userDataContext.prefs.moduleVisibility.chord,
                }
            })}
        >
            <div className={`flex flex-col gap-4 rounded-md bg-neutral-900 p-4 min-w-0 w-full`}>
                <div className={`flex gap-4`}>
                <div className={`flex flex-col h-60 w-70 overflow-y-scroll overflow-x-clip rounded-lg`}>
                    {userDataContext.chords.map((chord) => {
                        return (
                            <ChordPreview
                                chord={{...chord, root: chordContext.chord.root}}
                                active={chord.id === chordContext.chord.id}
                            />
                        )
                    })}
                </div>
                <div className={`flex flex-wrap gap-2 mb-10 max-w-full`}>
                    <div className={`flex flex-col gap-2 min-w-70`}>
                        <div className={`flex gap-4`}>
                            <h2 className={`font-bold text-3xl`}>{chordName || `${styleNoteName(chordContext.chord.root)}?`}</h2>
                            {!chordName && <Tooltip text={"Couldn't determine a name for this chord"}/>}
                            <ChordHeartButton chord={chordContext.chord}/>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setChordByName();
                        }}>
                            <label htmlFor={"chordNameSearch"} className={`text-xs font-light`}>search by
                                name</label>
                            <div className={`flex gap-1`}>
                                <input
                                    name={"chordNameSearch"}
                                    id={"chordNameSearch"}
                                    placeholder={styleNoteName(chordName as NoteName) || "Fmaj11"}
                                    className={`p-1 bg-black rounded-md ${badChordNameSearch && `border-1 border-red-500/50`}`}
                                    ref={chordNameSearchRef}
                                />
                                <Button type={"submit"} variant={"subtle"}>
                                    <FaSearch/>
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className={`flex min-w-0 overflow-x-scroll gap-2 mt-4`}>
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "Major", "minor"]}
                            onClick={(i) => {
                                let quality: "major" | "minor" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "major"
                                else quality = "minor"
                                setChordPickerOptions({...chordPickerOptions, quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.quality
                                if (option === null) return 0
                                if (option === "major") return 1
                                else return 2
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "sus2", "sus4"]}
                            onClick={(i) => {
                                let quality: "sus2" | "sus4" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "sus2"
                                else quality = "sus4"
                                setChordPickerOptions({...chordPickerOptions, sus: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.sus
                                if (option === null) return 0
                                if (option === "sus2") return 1
                                else return 2
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "aug", "dim"]}
                            onClick={(i) => {
                                let quality: "aug" | "dim" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "aug"
                                else quality = "dim"
                                setChordPickerOptions({
                                    ...chordPickerOptions,
                                    augDim: quality,
                                    fifth: quality ? null : chordPickerOptions.fifth
                                })
                            }}
                            active={(() => {
                                const fifthOption = chordPickerOptions.fifth
                                if (fifthOption) return 0
                                const option = chordPickerOptions.augDim
                                if (option === null) return 0
                                if (option === "aug") return 1
                                else return 2
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "♯5", "5", "♭5"]}
                            onClick={(i) => {
                                let quality: "perfect" | "flat" | "sharp" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "sharp"
                                else if (i === 2) quality = "perfect"
                                else quality = "flat"
                                setChordPickerOptions({
                                    ...chordPickerOptions,
                                    fifth: quality, augDim: quality ? null : chordPickerOptions.augDim
                                })
                            }}
                            active={(() => {
                                const option = chordPickerOptions.fifth
                                if (option === null) return 0
                                if (option === "sharp") return 1
                                if (option === "perfect") return 2
                                else return 3
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "M7", "7", "6"]}
                            onClick={(i) => {
                                let quality: "major" | "dom" | "sixth" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "major"
                                else if (i === 2) quality = "dom"
                                else quality = "sixth"
                                setChordPickerOptions({...chordPickerOptions, seventh: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.seventh
                                if (option === null) return 0
                                if (option === "major") return 1
                                if (option === "dom") return 2
                                else return 3
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "♯9", "9", "♭9"]}
                            onClick={(i) => {
                                let quality: "sharp" | "natural" | "flat" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "sharp"
                                else if (i === 2) quality = "natural"
                                else quality = "flat"
                                setChordPickerOptions({...chordPickerOptions, ninth: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.ninth
                                if (option === null) return 0
                                if (option === "sharp") return 1
                                if (option === "natural") return 2
                                else return 3
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "♯11", "11", "♭11"]}
                            onClick={(i) => {
                                let quality: "sharp" | "natural" | "flat" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "sharp"
                                else if (i === 2) quality = "natural"
                                else quality = "flat"
                                setChordPickerOptions({...chordPickerOptions, eleventh: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.eleventh
                                if (option === null) return 0
                                if (option === "sharp") return 1
                                if (option === "natural") return 2
                                else return 3
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "♯13", "13", "♭13"]}
                            onClick={(i) => {
                                let quality: "sharp" | "natural" | "flat" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "sharp"
                                else if (i === 2) quality = "natural"
                                else quality = "flat"
                                setChordPickerOptions({...chordPickerOptions, thirteenth: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.thirteenth
                                if (option === null) return 0
                                if (option === "sharp") return 1
                                if (option === "natural") return 2
                                else return 3
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "add2", "add9"]}
                            onClick={(i) => {
                                let quality: "add2" | "add9" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "add2"
                                else quality = "add9"
                                setChordPickerOptions({...chordPickerOptions, add2: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.add2
                                if (option === null) return 0
                                if (option === "add2") return 1
                                else return 2
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "add4", "add11"]}
                            onClick={(i) => {
                                let quality: "add4" | "add11" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "add4"
                                else quality = "add11"
                                setChordPickerOptions({...chordPickerOptions, add4: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.add4
                                if (option === null) return 0
                                if (option === "add4") return 1
                                else return 2
                            })()}
                        />
                        <ButtonGroup
                            orientation={"vertical"}
                            _children={["-", "add6", "add13"]}
                            onClick={(i) => {
                                let quality: "add6" | "add13" | null
                                if (i === 0) quality = null
                                else if (i === 1) quality = "add6"
                                else quality = "add13"
                                setChordPickerOptions({...chordPickerOptions, add6: quality})
                            }}
                            active={(() => {
                                const option = chordPickerOptions.add6
                                if (option === null) return 0
                                if (option === "add6") return 1
                                else return 2
                            })()}
                        /></div>

                </div>
            </div>

            <div className={`flex sm:flex-wrap md:flex-nowrap gap-4 items-center`}>
                <div className={`
                flex gap-1 mr-2 
                overflow-x-scroll overflow-y-hidden
                `}>
                    <ButtonGroup
                        onClick={setRootByIndex}
                        _children={tonesStyled.map(((ts) => {
                            return (
                                <span>{ts}</span>
                            )
                        }))}
                        active={tones.indexOf(chordContext.chord.root)}
                        styles={`w-10`}
                    />
                    <div className={`flex gap-1 justify-center mr-2`}>
                        <ButtonGroup
                            _children={["♭", "♮", "♯"].map(((symbol) => {
                                return (<span>{symbol}</span>)
                            }))}
                            onClick={(i) => {
                                switch (i) {
                                    case 0:
                                        chordContext.setAccidentalPref("flats")
                                        break;
                                    case 1:
                                        chordContext.setAccidentalPref(null)
                                        break;
                                    case 2:
                                        chordContext.setAccidentalPref("sharps")
                                }
                            }}
                            active={["flats", null, "sharps"].indexOf(chordContext.accidentalPref)}
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
                    <ButtonGroup
                        _children={[
                            <FaHandPaper />,
                            <MdMusicNote/>,
                            <RxFontRoman/>,
                        ]}
                        onClick={(i) => {
                            switch (i) {
                                case 0:
                                    chordContext.setIntervalPref("finger")
                                    break;
                                case 1:
                                    chordContext.setIntervalPref("note")
                                    break;
                                case 2:
                                    chordContext.setIntervalPref("interval")
                                    break;
                            }
                        }}
                        active={["finger", "note", "interval"].indexOf(chordContext.intervalPref)}
                        styles={`w-10 h-7`}
                    />
                    <Tooltip tooltipStyles={`bg-neutral-950`} children={
                        <div className={`flex flex-col gap-1`}>
                            <span className={`font-bold mb-2 block`}>Note labels</span>
                            <ul className={`[&_li]:flex [&_li]:items-center [&_li]:gap-1`}>
                                <li><FaHandPaper /> Fingering</li>
                                <li><MdMusicNote /> Letter</li>
                                <li><RxFontRoman />Interval</li>
                            </ul>
                        </div>
                    }/>
                </div>
            </div>
        </div>
        </ExpandableHeading>
    )
}