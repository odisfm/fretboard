import Button from "../generic/Button.tsx";

export default function DirtyScaleChooser({count, onClick, active}: {count: number, active: number, onClick: (idx: number) => void}) {
    return (
        <div className={`flex flex-wrap w-md p-2`}>
            {Array.from({length: count}).map((_, i) => {
                return (
                    <Button
                        onClick={() => onClick(i)}
                        variant={active === i ? "default" : "subtle"}
                    >
                        #{i+1}
                    </Button>
                )
            })}
        </div>
    )
}