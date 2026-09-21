import {FaQuestion, FaExclamation} from "react-icons/fa";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

type Props = {
    icon?: "bang" | "question"
    children?: React.ReactNode
    text?: string
    iconStyles?: string,
    tooltipStyles?: string,
}

type Side = { x: "left" | "right"; y: "top" | "bottom" };

function getSide(el: HTMLElement): Side {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right",
        y: rect.top + rect.height / 2 < window.innerHeight / 2 ? "top" : "bottom",
    };
}

export default function Tooltip({
                                    icon = "question",
                                    children,
                                    text,
                                    iconStyles = "",
                                    tooltipStyles = "",
                                }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [side, setSide] = useState<Side>({x: "left", y: "top"});
    const [manualVisible, setManualVisible] = useState<boolean>(false);

    const updateSide = useCallback(() => {
        if (ref.current) setSide(getSide(ref.current));
    }, []);

    useLayoutEffect(() => {
        updateSide();
        window.addEventListener("resize", updateSide);
        // capture phase so scrolling inside any container also recomputes
        window.addEventListener("scroll", updateSide, true);
        return () => {
            window.removeEventListener("resize", updateSide);
            window.removeEventListener("scroll", updateSide, true);
        };
    }, [updateSide]);

    useEffect(() => {
        function dismissOnClickOutside() {
            setManualVisible(false)
        }

        if (manualVisible) {
            document.addEventListener("click", dismissOnClickOutside);
        } else {
            document.removeEventListener("click", dismissOnClickOutside);
        }
    }, [manualVisible]);

    const horizontal = side.x === "left" ? "left-0" : "right-0";
    const vertical = side.y === "top" ? "top-full mt-2" : "bottom-full mb-2";

    return (
        <div className="inline-flex mt-1" ref={ref} onPointerEnter={updateSide}>
            <div className={`
                relative h-3 text-xs aspect-square rounded-full group
                bg-black hover:bg-white text-white hover:text-black flex items-center justify-center
                ${iconStyles}
            `}
                 onClick={(e) => {
                     e.stopPropagation();
                     setManualVisible(!manualVisible)
                 }}
            >
                {icon === "question" && <FaQuestion size={10}/>}
                {icon === "bang" && <FaExclamation size={12}/>}
                <div className={`
                    absolute ${vertical} ${horizontal}
                    w-50 max-w-[50dvw]
                    invisible group-hover:visible ${manualVisible && "!visible"}
                    p-4 bg-neutral-900 text-white z-[1000] ${tooltipStyles}
                `}
                >
                    {children ?? text}
                </div>
            </div>
        </div>
    )
}