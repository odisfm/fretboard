type Props = {
    label: string
    interval: string
    opacity?: number
    styles?: string
}

export function ScaleDot({label, interval, opacity, styles}: Props) {
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
            h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ${intervalStyles} ${styles}
            `}
            style={{
                opacity: `${opacity || 100}%`
            }}
        >
            {label}
        </div>
    )
}