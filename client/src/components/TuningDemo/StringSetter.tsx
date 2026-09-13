import {FaMinusCircle, FaPlusCircle, FaTrash} from "react-icons/fa"
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import Button from "../generic/Button.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";

type Props = {
    pitch: number;
    idx: number;
    incrementPitch: (idx: number, increment: number) => void;
    deleteString: (idx: number) => void;
}

export default function StringSetter({pitch, idx, incrementPitch, deleteString}: Props) {
    const scaleContext = useScale()
    return (
        <div className={`flex gap-2 w-full`}>
            <div className={`flex`}>
                <Button
                    variant={"subtle"}
                    onClick={() => incrementPitch(idx, -1)}
                >
                    <FaMinusCircle/>
                </Button>
                <Button
                    variant={"subtle"}
                    onClick={() => incrementPitch(idx, 1)}
                >
                    <FaPlusCircle/>
                </Button>
            </div>
            <div
                className={`font-bold ml-6`}
            >
                <span>{midiPitchToNoteName(pitch, true, scaleContext.accidentalPref || "sharps")}</span>
            </div>
            <Button
                onClick={() => deleteString(idx)}
                variant={"warning"}
                styles={`ml-auto`}
            >
                <FaTrash/>
            </Button>
        </div>
    )
}
