import {FaSpinner} from "react-icons/fa";

export default function Spinner({classes}: {classes?: string}) {
    return (
        <FaSpinner className={`animate-spin ${classes}`}/>
    )
}
