import Button from "../generic/Button.tsx";
import { IoAddCircle } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";

type Props = {
    insertString: () => void;
    deleteString: () => void;
}
export function RangeMutator({insertString, deleteString}: Props) {
    return (
        <div className={`flex flex-col gap-2`}>
            <Button
                onClick={insertString}
                variant={"subtle"}
                styles={`text-xl justify-center`}
            >
                <IoAddCircle />
            </Button>
            <Button
                onClick={deleteString}
                variant={"subtle"}
                styles={`justify-center`}
            >
                <TiDeleteOutline />
            </Button>
        </div>
    )
}