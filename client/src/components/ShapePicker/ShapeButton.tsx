import type { ScaleShape } from "@fretboard/shared/types/scale";
import Button from "../generic/Button.tsx";
import ShapePreview from "./ShapePreview.tsx";
import FavButton from "../generic/FavButton.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {useMemo} from "react";

type Props = {
    onClick: (index: number) => void;
    setScrollToFret: (index: number) => void;
    active: number | null;
    scaleShape: ScaleShape;
    index: number
}

export default function ShapeButton({onClick, setScrollToFret, scaleShape, index, active}: Props) {
    const userDataContext = useUserData()
    const isFav = useMemo(() => {
        return userDataContext.shapes.findIndex((s) => s.id === scaleShape.id) !== -1
    }, [userDataContext.shapes, scaleShape])

    function toggleFav(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation();
        userDataContext.toggleSavedShape(scaleShape)
    }

    const favShapeFitted = isFav && scaleShape?.isAdjusted

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
                        setScrollToFret(scaleShape.lowFret)
                    }}
                    variant={active === index ? "default" : "subtle"}
                    styles={`z-30`}
                >
                <ShapePreview shape={scaleShape}/>
                </Button>
            </div>
    )
}
