import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {NumberStepper} from "../generic/NumberStepper.tsx";
import { PiCaretCircleDownFill, PiCaretCircleUpFill } from "react-icons/pi";

type Props = {
    pitch: number;
    idx: number;
    incrementPitch: (idx: number, increment: number) => void;
}

export default function StringTuner({pitch, idx, incrementPitch}: Props) {
    return (
        <NumberStepper
            display={true}
            value={pitch}
            incrementFn={() => incrementPitch(idx, 1)}
            decrementFn={() => incrementPitch(idx, -1)}
            lowerBound={0}
            upperBound={127}
            valueDisplayFn={() => midiPitchToNoteName(pitch)}
            orientation={"vertical-flip"}
            displayStyles={`min-w-15 p-2 flex justify-center bg-black rounded-full text-xs font-bold`}
            buttonStyles={`flex justify-center text-xl`}
            compStyles={`gap-1`}
            variant={`subtle`}
            decIcon={<PiCaretCircleDownFill/>}
            incIcon={<PiCaretCircleUpFill/>}
        />
    )
}
