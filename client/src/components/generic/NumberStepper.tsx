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
    compStyles?: string
    valueDisplayFn?: (value: unknown) => string
    orientation?: "horizontal" | "vertical" | "vertical-flip"
    decIcon?: React.ReactNode
    incIcon?: React.ReactNode
}

export function NumberStepper(
    {
        display, value, incrementFn, decrementFn, variant, upperBound, lowerBound,
        displayStyles, buttonStyles, compStyles, valueDisplayFn, orientation, decIcon, incIcon
    }: Props) {
    const canIncrement =
        typeof value !== "number" || (typeof upperBound === "number" && value < upperBound);
    const canDecrement =
        typeof value === "number" && (typeof lowerBound === "number" && value > lowerBound);

    orientation = orientation || "horizontal"

    let text: string
    if (valueDisplayFn) {
        text = valueDisplayFn(value)
    } else {
        text = String(value)
    }

    return (
        <div className={`
        flex ${orientation === "vertical" && "flex-col"} 
        ${orientation === "vertical-flip" && `flex-col-reverse`}
        ${compStyles}
        `}>
            <Button
                variant={variant || "default"}
                disabled={!canDecrement}
                onClick={decrementFn}
                styles={buttonStyles}
            >
                {decIcon ? decIcon : <FaMinus/>}
            </Button>
            { display &&
                <div className={`flex items-center px-4 ${displayStyles}`}>
                    <span>{text}</span>
                </div>
            }
            <Button
                variant={variant || "default"}
                disabled={!canIncrement}
                onClick={incrementFn}
                styles={buttonStyles}
            >
                {incIcon ? incIcon : <FaPlus/>}
            </Button>
        </div>
    )
}
