export function FretDotSide({style, orientation}: {
    style: null | "single" | "double",
    orientation: "horizontal" | "vertical"
}) {
    const dotStyles = `h-2 w-2 bg-gray-400 rounded-full`

    return (
        <div className={`z-30 
        flex ${orientation === "vertical" && "flex-col"} gap-1 p-2 items-center justify-center w-full`}>
            {style !== null &&
                <div className={dotStyles}></div>
            }
            {style === "double" &&
                <>
                    <div className={"h-2 w-2"}/>
                    <div className={dotStyles}></div>
                </>
            }
        </div>
    )
}
