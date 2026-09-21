import {FaQuestion, FaExclamation} from "react-icons/fa";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

type Props = {
    icon?: "bang" | "question"
    children?: React.ReactNode
    text?: string
    iconStyles?: string
    tooltipStyles?: string
};

type Pos = { top: number; left: number; transform: string };

const GAP = 8;

function getPos(el: HTMLElement): Pos {
    const r = el.getBoundingClientRect();
    const alignLeft = r.left + r.width / 2 < window.innerWidth / 2;
    const below = r.top + r.height / 2 < window.innerHeight / 2;

    return {
        left: alignLeft ? r.left : r.right,
        top: below ? r.bottom + GAP : r.top - GAP,
        transform: `translate(${alignLeft ? "0" : "-100%"}, ${below ? "0" : "-100%"})`,
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
    const [pos, setPos] = useState<Pos | null>(null);
    const [hovered, setHovered] = useState(false);
    const [manualVisible, setManualVisible] = useState(false);

    const open = hovered || manualVisible;

    const updatePos = useCallback(() => {
        if (ref.current) setPos(getPos(ref.current));
    }, []);

    useLayoutEffect(() => {
        if (!open) return;
        updatePos();
        window.addEventListener("resize", updatePos);
        window.addEventListener("scroll", updatePos, true);
        return () => {
            window.removeEventListener("resize", updatePos);
            window.removeEventListener("scroll", updatePos, true);
        };
    }, [open, updatePos]);

    useEffect(() => {
        if (!manualVisible) return;
        const dismiss = () => setManualVisible(false);
        document.addEventListener("click", dismiss);
        return () => document.removeEventListener("click", dismiss);
    }, [manualVisible]);

    return (
        <div className="inline-flex mt-1">
            <div
                ref={ref}
                className={`
                    h-3 text-xs aspect-square rounded-full
                    bg-black hover:bg-white text-white hover:text-black
                    flex items-center justify-center ${iconStyles}
                `}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setManualVisible(v => !v);
                }}
            >
                {icon === "question" && <FaQuestion size={10}/>}
                {icon === "bang" && <FaExclamation size={12}/>}
            </div>

            {open && pos && createPortal(
                <div
                    style={{top: pos.top, left: pos.left, transform: pos.transform}}
                    className={`
                        fixed w-50 max-w-[50dvw] p-4
                        bg-neutral-900 text-white z-[1000] pointer-events-none
                        ${tooltipStyles}
                    `}
                >
                    {children ?? text}
                </div>,
                document.body
            )}
        </div>
    );
}