import { MdError } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";

export function PasswordValidHint({badPasswordFeatures, passwordIssues}: {
    badPasswordFeatures: string[],
    passwordIssues: string[],
}) {

    return (
        <ul>
            {badPasswordFeatures.map((f, i) => {
                const relevant = passwordIssues.includes(f);
                return (
                    <li key={i} className={`flex gap-2 items-center my-1`}>
                        {
                            relevant ?
                            <MdError className={`text-red-600`} />
                            :
                            <IoMdCheckmarkCircle className={`text-lime-500`} />
                        }
                        <span className={`${!relevant && `line-through`}`}>{f}</span>
                    </li>
                )
            })}
        </ul>
    )
}