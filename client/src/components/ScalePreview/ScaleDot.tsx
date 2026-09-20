type Props = {
    label: string
    interval: string
    opacity?: number
}

export function ScaleDot({label, interval, opacity}: Props) {
    let intervalStyles = ""

    switch (interval) {
        case "P1":
            intervalStyles = "bg-red-500 text-white"
            break
        case "P5":
            intervalStyles = "bg-orange-500 text-white"
            break
        default:
            intervalStyles = "bg-neutral-200 text-black"
            break
    }

    return (
        <div
            className={`
            h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ${intervalStyles}
            `}
            style={{
                opacity: `${opacity || 100}%`
            }}
        >
            {label}
        </div>
    )
}