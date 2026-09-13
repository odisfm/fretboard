import Button, {type ButtonVariant} from "./Button.tsx";
import { FaPlus, FaMinus } from "react-icons/fa6";

type Props = {
    display: boolean;
    value: string | number | null
    incrementFn: () => void;
    decrementFn: () => void;
    variant?: ButtonVariant;
    lowerBound?: number
    upperBound?: number
    displayStyles?: string
    buttonStyles?: string
}

export function NumberStepper(
    {
        display, value, incrementFn, decrementFn, variant, upperBound, lowerBound, displayStyles, buttonStyles
    }: Props) {
    const canIncrement =
        typeof value !== "number" || (typeof upperBound === "number" && value < upperBound);
    const canDecrement =
        typeof value === "number" && (typeof lowerBound === "number" && value > lowerBound);
    return (
        <div className={`flex`}>
            <Button
                variant={variant || "default"}
                disabled={!canDecrement}
                onClick={decrementFn}
                styles={buttonStyles}
            >
                <FaMinus />
            </Button>
            { display &&
                <div className={`flex items-center px-4 ${displayStyles}`}>
                    <span>{value}</span>
                </div>
            }
            <Button
                variant={variant || "default"}
                disabled={!canIncrement}
                onClick={incrementFn}
                styles={buttonStyles}
            >
                <FaPlus />
            </Button>
        </div>
    )
}
