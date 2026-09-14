import Button from "./Button.tsx";
import { TiTick } from "react-icons/ti";

type Props = {
    state: boolean,
    fn: (newState: boolean) => void,
}

export function BinaryToggle({state, fn}: Props) {
    const onStyles = `bg-white text-black hover:bg-neutral-300`
    const offStyles = `bg-neutral-700 hover:bg-neutral-600 text-white`
    return (
        <div className={`mt-1.5 flex rounded-md w-15 h-5 bg-neutral-800 ${state ? "justify-end" : "justify-start"}`}>
            <Button
                onClick={() => fn(!state)}
                variant="unstyled"
                styles={`w-8 ${state ? onStyles : offStyles}`}
            >
                {
                    state && <TiTick/>
                }
            </Button>
        </div>
    )
}