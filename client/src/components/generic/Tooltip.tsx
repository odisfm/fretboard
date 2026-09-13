import {FaQuestion, FaExclamation} from "react-icons/fa";
import {useLayoutEffect, useRef, useState} from "react";

type Props = {
    icon?: "bang" | "question"
    children?:  React.ReactNode
    text?: string
}

function getSide(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
}

export default function Tooltip({icon, children, text}: Props) {
    if (!icon) {
        icon = "question"
    }
    const ref = useRef(null);
    const [side, setSide] = useState<"left" | "right" | null>(null);

    useLayoutEffect(() => {
        if (!ref.current) return;

        const el = ref.current;

        function updateSide() {
            setSide(getSide(el));
        }

        updateSide();

        window.addEventListener("resize", updateSide);
        return () => window.removeEventListener("resize", updateSide);
    }, []);

    return (
        <div className={`inline-flex mt-1`} ref={ref}>
            <div className={`
        relative h-3 text-xs aspect-square rounded-full group bg-black hover:bg-white text-white hover:text-black flex items-center justify-center
        `}>
                {icon === "question" && <FaQuestion size={10}/>}
                {icon === "bang" && <FaExclamation/>}
                <div className={`
                absolute top-full invisible group-hover:visible 
                p-4 bg-neutral-900 text-white max-w-sm z-[1000]
                ${side === "left" ? `left-1` : `right-1`}
                `}>
                    {children ? children : text}
                </div>
            </div>
        </div>
    )
}