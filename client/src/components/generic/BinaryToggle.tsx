import { TiTick } from "react-icons/ti";

type Props = {
    state: boolean,
    fn: (newState: boolean) => void,
}

export function BinaryToggle({state, fn}: Props) {
    const onStyles = `bg-white text-black group-hover:bg-neutral-300`
    const offStyles = `bg-neutral-700 group-hover:bg-neutral-600 text-white`
    return (
        <button
            className={`
            group mt-1.5 flex rounded-md w-15 h-5 bg-neutral-800 
            ${state ? "justify-end" : "justify-start"}
            cursor-pointer
            `}
            onClick={() => fn(!state)}
        >
            <div
                // variant="unstyled"
                className={`rounded-md flex items-center justify-center w-8 h-full ${state ? onStyles : offStyles}`}
            >
                {
                    state && <TiTick/>
                }
            </div>
        </button>
    )
}