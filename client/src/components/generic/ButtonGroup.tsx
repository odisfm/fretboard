import {type Props as ButtonProps} from './Button'
import Button from './Button'

type Props = Omit<ButtonProps, 'onClick' | 'disabled'> & {
    active?: number
    onClick: (i: number) => void
    _children: React.ReactNode[]
    activeStyles?: string
    inactiveStyles?: string
    containerStyles?: string
    orientation?: "horizontal" | "vertical",
    disabled?: boolean[]
}

export function ButtonGroup(
    {
        orientation, active, onClick, _children, activeStyles,
        inactiveStyles, styles, variant, loading, disabled, containerStyles
    }: Props) {
    const _variant = variant || 'unstyled'
    const _activeStyles = activeStyles || `bg-white text-black !hover:bg-white hover:text-black font-bold`
    const _inactiveStyles = inactiveStyles || `bg-neutral-950 text-white hover:bg-neutral-800`
    const _orientation = orientation || 'horizontal'

    return (
        <div className={`flex ${_orientation === "vertical" && `flex-col`} ${containerStyles}`}>
            {_children.map((child, i) => {
                let theseStyles = ``
                const first = i === 0
                const last = (i === _children.length - 1)
                if (_orientation === "horizontal") {
                    if (first) {
                        theseStyles += `rounded-l-md rounded-r-none`
                    } else if (last) {
                        theseStyles += `rounded-r-md rounded-l-none`
                    } else {
                        theseStyles += `!rounded-none`
                    }
                } else {
                    if (first) {
                        theseStyles += `rounded-t-md rounded-b-none`
                    } else if (last) {
                        theseStyles += `rounded-b-md rounded-t-none`
                    } else {
                        theseStyles += `!rounded-none`
                    }
                }

                return (
                    <Button
                        onClick={() => onClick(i)}
                        variant={_variant}
                        styles={`
                          justify-center ${styles} ${i === active ? _activeStyles : _inactiveStyles} ${theseStyles}
                        `}
                        loading={loading}
                        disabled={disabled ? disabled[i] : false}
                        key={i}
                    >
                        {child}
                    </Button>
                )
            })}
        </div>
    )
}