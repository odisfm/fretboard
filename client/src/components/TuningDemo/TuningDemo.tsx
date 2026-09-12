import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {FaPlusCircle} from "react-icons/fa"
import StringSetter from "./StringSetter.tsx";

export default function TuningDemo() {
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning

    function incrementPitch(idx: number, increment: number) {
        const strings = [...tuning.strings]
        strings[idx] = strings[idx] + increment
        tuningContext.setTuning({
            ...tuning,
            strings
        })
    }

    function deleteString(idx: number) {
        const strings = [...tuning.strings]
        if (strings.length === 1) return
        strings.splice(idx, 1)
        tuningContext.setTuning({
            ...tuning,
            strings
        })
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
        tuningContext.setTuning({
            ...tuning,
            strings
        })
    }

    return (
        <div className={`flex flex-col gap-2 items-center w-sm p-2 bg-neutral-900`}>
            <span className={`font-bold`}>{tuning.name || "Unnamed tuning"}</span>
            <button
                onClick={() => insertString("bottom")}
            >
                <FaPlusCircle/>
            </button>
            <div className={`flex flex-col gap-1 w-full`}>
                {tuning.strings.map((s, i) => {
                    return (
                        <StringSetter
                            pitch={s}
                            idx={i}
                            incrementPitch={incrementPitch}
                            deleteString={deleteString}
                        />
                    )
                })}
            </div>
            <button
                onClick={() => insertString("top")}
            >
                <FaPlusCircle/>
            </button>
        </div>
    )
}