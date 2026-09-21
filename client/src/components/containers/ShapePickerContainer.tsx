export function ShapePickerContainer({children}: {children: React.ReactNode}) {
    return (
        <div className={`flex flex-col p-2 rounded-md bg-neutral-950 gap-2 min-h-60`}>
            {children}
        </div>
    )
}