import Button from "./Button.tsx";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";

type Props = {
    active: boolean
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    styles?: string;
    extraHeartStyles?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function FavButton({active, onClick, styles, children, extraHeartStyles}: Props) {
    const commonStyles = ``
    const activeStyles = ``
    const inactiveStyles = ``
    const heartStyles = `${extraHeartStyles} ${commonStyles} ${active ? activeStyles : inactiveStyles}`
    return (
        <Button
            styles={`${heartStyles} ${styles}`}
            variant={"subtle"}
            onClick={onClick}
        >
            <div className={`relative p-2`}>
                <IoMdHeartEmpty className={`absolute inset-0`} />
                <IoMdHeart className={`
                    absolute inset-0 text-red-500 transition-opacity
                    ${active ? `opacity-100` : `opacity-0`} ${extraHeartStyles}
                `} />
            </div>
            {children}
        </Button>
    )
}
