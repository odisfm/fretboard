import {useTuning} from "../../contexts/tuning/useTuning.ts";
import StringTuner from "./StringTuner.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {RangeMutator} from "./RangeMutator.tsx";

export default function TuningDemo() {
    const userDataContext = useUserData()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning

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

    return (
        <div className={`flex flex-col flex-1 gap-4 p-2 bg-neutral-900`}>
            <select
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