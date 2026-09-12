import {FaMinusCircle, FaPlusCircle, FaTrash} from "react-icons/fa"
import {midiPitchToNoteName} from "@fretboard/shared/src/utils/midiPitchToNoteName.ts";

type Props = {
    pitch: number;
    idx: number;
    incrementPitch: (idx: number, increment: number) => void;
    deleteString: (idx: number) => void;
}

export default function StringSetter({pitch, idx, incrementPitch, deleteString}: Props) {
    return (
        <div className={`flex gap-2 w-full`}>
            <div className={`flex gap-1`}>
                <button
                    className={``}
                    onClick={() => incrementPitch(idx, -1)}
                >
                    <FaMinusCircle/>
                </button>
                <button
                    className={``}
                    onClick={() => incrementPitch(idx, 1)}
                >
                    <FaPlusCircle/>
                </button>
            </div>
            <div
                className={`font-bold ml-6`}
            >
                <span>{midiPitchToNoteName(pitch, true)}</span>
            </div>
            <button
                onClick={() => deleteString(idx)}
                className={`ml-auto`}
            >
                <FaTrash/>
            </button>
        </div>
    )
}
