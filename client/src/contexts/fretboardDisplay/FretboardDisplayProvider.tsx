import {
    FretboardDisplayContext,
    type FretboardDisplayContextValue,
} from "./FretboardDisplayContext.ts";

export function FretboardDisplayProvider({children, value}: {
    children: React.ReactNode,
    value: FretboardDisplayContextValue
}) {

    return (
        <FretboardDisplayContext value={value}>
            {children}
        </FretboardDisplayContext>
    )
}
