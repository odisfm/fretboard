type Props = {
    orientation: "horizontal" | "vertical";
}


export default function FretVisual({ orientation }: Props) {
    const girth = 2
    return (
        <div
            className="bg-neutral-700 absolute -z-20"
            style={{
                height: orientation === "horizontal" ? "100%" : `${girth}px`,
                width: orientation === "vertical" ? "100%" : `${girth}px`,
                left: orientation === "horizontal" ? 0 : undefined,
                bottom: orientation === "vertical" ? 0 : undefined,
            }}
        />
    )
}