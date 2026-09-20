import {useTuning} from "../../contexts/tuning/useTuning.ts";
import StringTuner from "./StringTuner.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {RangeMutator} from "./RangeMutator.tsx";
import Button from "../generic/Button.tsx";
import {v4 as createUuid} from "uuid";
import {useMemo, useState} from "react";
import {LexoRank} from "@dalet-oss/lexorank";
import { IoAddCircle } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import type {Tuning} from "@fretboard/shared/types/tuning";
import {TuningPreview} from "../TuningPreview/TuningPreview.tsx";
import {ExpandableHeading} from "../ExpandableHeading.tsx";

type SegmentedTuningList = {
    instrument: string | null,
    tunings: Tuning[]
}[]

export default function TuningDemo() {
    const userDataContext = useUserData()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [createTuningWait, setCreateTuningWait] = useState<boolean>(false)
    const [deleteTuningWait, setDeleteTuningWait] = useState<boolean>(false)

    function incrementPitch(idx: number, increment: number) {
        const strings = [...tuning.strings]
        strings[idx] = strings[idx] + increment
        const newTuning = {
            ...tuning,
            strings
        }
        tuningContext.setTuning(newTuning)
        userDataContext.updateTuning(newTuning)
    }

    function deleteString(idx: number) {
        const strings = [...tuning.strings]
        if (strings.length === 1) return
        strings.splice(idx, 1)
        const newTuning = {
            ...tuning,
            strings
        }
        tuningContext.setTuning(newTuning)
        userDataContext.updateTuning(newTuning)
    }

    function insertString(position: "bottom" | "top") {
        let strings = [...tuning.strings]
        if (position === "bottom") {
            const neighbour = strings.at(0)!
            strings = [neighbour - 5, ...strings]
        } else {
            const neighbour = strings.at(-1)!
            strings = [...strings, neighbour + 5]
        }
        const newTuning = {
            ...tuning,
            strings
        }
        tuningContext.setTuning(newTuning)
        userDataContext.updateTuning(newTuning)
    }

    async function createTuning() {
        setCreateTuningWait(true)
        const lastOrder = userDataContext.tunings.at(-1)!.order
        const newTuning = await userDataContext.createTuning({
            ...tuning,
            id: createUuid(),
            name: "",
            order: LexoRank.parse(lastOrder).genNext()["value"]
        })
        if (newTuning) {
            tuningContext.setTuning(newTuning)
        }
        setCreateTuningWait(false)
    }

    async function deleteTuning() {
        const toDeleteTuning = tuning
        if (userDataContext.tunings[0] !== toDeleteTuning) {
            tuningContext.setTuning(userDataContext.tunings[0])
        } else {
            tuningContext.setTuning(userDataContext.tunings[1])
        }
        setDeleteTuningWait(true)
        await userDataContext.deleteTuning(toDeleteTuning)
        setDeleteTuningWait(false)
        tuningContext.setTuning(userDataContext.tunings[0])
    }

    const segmentedTunings: SegmentedTuningList = useMemo(() => {
        const instrumentIndices: string[] = []
        const noInstrumentTunings: Tuning[] = []
        const list: SegmentedTuningList = []
        for (const t of userDataContext.tunings) {
            const instrument = t.instrument
            if (!instrument) {
                noInstrumentTunings.push(t)
                continue
            }
            const idx = instrumentIndices.indexOf(instrument!)
            if (idx === -1) {
                instrumentIndices.push(instrument)
                list.push({instrument: instrument, tunings: [t]})
            } else {
                list[idx].tunings.push(t)
            }
        }
        list.sort((a, b) => {
            if (a.tunings.length > b.tunings.length) {
                return -1
            } else if (a.tunings.length < b.tunings.length) {
                return 1
            }
            return 0
        })
        if (noInstrumentTunings.length) list.push({instrument: null, tunings: [...noInstrumentTunings]})
        return list
    }, [userDataContext.tunings])

    return (
        <ExpandableHeading heading={"Tuning"} collapsedHeading={`Tuning | ${tuning.name}`}>
            <div className={`flex gap-4 p-4 bg-neutral-900 rounded-md w-min`}>
                <div className={`flex flex-col gap-2`}>
                    <h2 className={`text-2xl font-bold`}>{tuning.name}</h2>
                    <div className={`flex gap-2 items-center overflow-x-scroll`}>
                        <RangeMutator
                            insertString={() => insertString("bottom")}
                            deleteString={() => deleteString(0)}
                        />
                        <div className={`flex gap-1`}>
                            {tuning.strings.map((s, i) => {
                                return (
                                    <StringTuner
                                        key={i}
                                        pitch={s}
                                        idx={i}
                                        incrementPitch={incrementPitch}
                                    />
                                )
                            })}
                        </div>
                        <RangeMutator
                            insertString={() => insertString("top")}
                            deleteString={() => deleteString(tuning.strings.length - 1)}
                        />
                    </div>
                </div>

                <div className={`flex gap-2 min-w-0`}>
                    <div className={`flex flex-col gap-2 w-15 items-stretch mt-auto`}>
                        <Button
                            onClick={createTuning}
                            loading={createTuningWait}
                            styles={`!bg-lime-700 hover:!bg-lime-600 justify-center`}
                        >
                            <IoAddCircle/>
                        </Button>
                        <Button
                            onClick={deleteTuning}
                            loading={deleteTuningWait}
                            variant={"warning"}
                            styles={`justify-center`}
                        >
                            <FaTrash/>
                        </Button>
                    </div>
                    <div className={`flex flex-col w-50 h-60 rounded-lg overflow-y-scroll bg-black`}>
                        {segmentedTunings.map((instrument) => {
                            return (
                                <div className={`w-full flex flex-col`}>
                                    <div className={`p-2 bg-black font-bold text-right pr-4`}>
                                        {instrument.instrument ? instrument.instrument : "Unlabelled instrument"}
                                    </div>
                                    {
                                        instrument.tunings.map((tuning) => {
                                            return (
                                                <TuningPreview
                                                    tuning={tuning}
                                                    active={tuning.id === tuningContext.tuning.id}
                                                    onClick={(id) => {
                                                        const tuning = userDataContext.tunings.find(
                                                            (tuning) => tuning.id === id)
                                                        if (!tuning) return
                                                        tuningContext.setTuning(tuning)
                                                    }}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </ExpandableHeading>
    )
}