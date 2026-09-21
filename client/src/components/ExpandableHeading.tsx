import {FaCaretDown, FaCaretRight} from "react-icons/fa";

type Props = {
    children: React.ReactNode,
    expanded: boolean,
    heading: string
    collapsedHeading?: string
    onToggle(): void
}


export function ExpandableHeading({children, expanded, heading, collapsedHeading, onToggle}: Props) {

    return (
        <section className={`flex flex-col gap-2 mt-4`}>
            <div className={`flex gap-2 items-center bg-black px-4 py-2 rounded-md self-start`}>
                <button
                    onClick={() => onToggle()}
                    className={`
                    text-xl p-1 rounded-full cursor-pointer border-2 border-transparent hover:border-neutral-600
                    flex items-center justify-center
                    `}
                >
                    {expanded ? <FaCaretDown /> : <FaCaretRight /> }
                </button>
                <button onClick={() => onToggle()}>
                    <h2 className={`text-2xl font-bold cursor-pointer`}>
                        {expanded ? heading : collapsedHeading || heading}
                    </h2>
                </button>
            </div>
            <div className={`${!expanded && `w-0 h-0 overflow-hidden`}`}>
                {children}
            </div>
        </section>
    )
}