type Props = {
    orientation: "horizontal" | "vertical";
}

export default function StringVisual(
    {
        orientation,
    }: Props) {

    const girthPx = 3

    return (
        <div
            className="absolute bg-neutral-500 -z-10"
            style={{
                width: orientation === "horizontal" ? "100%" : `${girthPx}px`,
                height: orientation === "vertical" ? "100%" : `${girthPx}px`,
                top: orientation === "horizontal" ? "50%" : "0",
                left: orientation === "vertical" ? "50%" : "0",
                transform:
                    orientation === "horizontal" ? "translateY(-50%)" :
                        orientation === "vertical" ? "translateX(-50%)" : undefined,
            }}
        />
    )
}
