import Button from "../generic/Button.tsx";
import ShapePreview from "./ShapePreview.tsx";
import FavButton from "../generic/FavButton.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {useMemo} from "react";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";
import type {ScaleShape} from "@fretboard/shared/types/scale";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";

type Props = {
    onClick: (index: number) => void;
    setScrollToFret: (index: number) => void;
    active: number | null;
    fingerShape: FingerShape;
    index: number
}

export default function ShapeButton({onClick, setScrollToFret, fingerShape, index, active}: Props) {
    const userDataContext = useUserData()
    const fdContext = useFretboardDisplay()
    const isFav = useMemo(() => {
        return userDataContext.shapes.findIndex((s) => s.id === fingerShape.id) !== -1
    }, [userDataContext.shapes, fingerShape])

    function toggleFav(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation();
        if (fingerShape.scale) {
            userDataContext.toggleSavedShape(fingerShape as ScaleShape)
        }
    }

    const scrollToFret = useMemo(() => {
        if (fdContext.type === "scale") {
            return fingerShape.lowFret
        } else {
            let lowFret = Infinity
            for (const p of fingerShape.shape) {
                if (p.fret && p.fret < lowFret) lowFret = p.fret
            }
            return lowFret > 3 ? lowFret : 0
        }
    }, [fingerShape, fdContext.type])

    const favShapeFitted = isFav && fingerShape?.isAdjusted

    return (

            <div
                className={`flex flex-col gap-1`}
            >
                <div className={`flex items-center w-full`}>
                    <FavButton
                        active={isFav}
                        onClick={toggleFav}
                        styles={`self-start`}
                        extraHeartStyles={`${favShapeFitted && `!text-lime-400`}`}
                    />
                    <span className={`ml-auto text-xs font-bold`}><sup>#</sup>{`${index + 1}`}</span>
                </div>
                <Button
                    onClick={() => {
                        onClick(index)
                        setScrollToFret(scrollToFret)
                    }}
                    variant={active === index ? "default" : "subtle"}
                    styles={`z-30`}
                >
                <ShapePreview shape={fingerShape}/>
                </Button>
            </div>
    )
}
