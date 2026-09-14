import {useTuning} from "../../contexts/tuning/useTuning.ts";
import StringTuner from "./StringTuner.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {RangeMutator} from "./RangeMutator.tsx";
import Button from "../generic/Button.tsx";
import {v4 as createUuid} from "uuid";
import {useState} from "react";
import {LexoRank} from "@dalet-oss/lexorank";
import { IoAddCircle } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

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

    return (
        <div className={`flex flex-col flex-1 gap-4 p-2 bg-neutral-900`}>
            <div className={`flex gap-2`}>
                <select
                    value={userDataContext.tunings.findIndex((t) => t.id === tuning.id)}
                    onChange={(event) => {
                        const newTuning = userDataContext.tunings[Number(event.target.value)]
                        tuningContext.setTuning(newTuning)
                    }}
                    className={`bg-black p-1 rounded-md self-start`}
                >
                    {userDataContext.tunings.map((tuning, i) => {
                        return <option value={i} key={i}>
                            {`${tuning.name || "unnamed tuning"}${tuning.instrument && ` (${tuning.instrument})`}`}
                        </option>
                    })}
                </select>
                <Button
                    onClick={createTuning}
                    loading={createTuningWait}
                    styles={`!bg-lime-700 hover:!bg-lime-600 w-10 justify-center`}
                >
                    <IoAddCircle />
                </Button>
                <Button
                    onClick={deleteTuning}
                    loading={deleteTuningWait}
                    variant={"warning"}
                >
                    <FaTrash />
                </Button>
            </div>
            <div className={`flex gap-2 items-center overflow-x-scroll w-full`}>
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
    )
}