import Spinner from "./Spinner.tsx";

export type ButtonVariant = "default" | "warning" | "subtle" | "unstyled"

export type Props = {
    disabled?: boolean
    loading?: boolean
    variant?: ButtonVariant
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    styles?: string
}

export default function Button(
    {
        disabled,
        loading,
        onClick,
        children,
        variant = "default",
        styles,


    }: Props) {
    let variantStyles: string
    switch (variant) {
        case "default":
            variantStyles = "bg-slate-600 hover:bg-slate-700";
            break;
        case "warning":
            variantStyles = "bg-red-700 hover:bg-red-600";
            break;
        case "subtle":
            variantStyles = "border-2 border-transparent hover:border-white/10 hover:bg-white/5";
            break;
        default:
            variantStyles = "";
            break;
    }
    let cursorStyle = "cursor-pointer";
    if (disabled) {
        cursorStyle = "cursor-not-allowed";
    } else if (loading) {
        cursorStyle = "cursor-wait";
    }

    return (
        <button
            onClick={(e) => {
                if (disabled || loading || !onClick) return
                onClick(e)
            }}
            disabled={disabled}
            className={`
            flex items-center gap-2 py-1 px-2 rounded-sm
            ${cursorStyle} ${styles} ${variantStyles} 
            `}
        >
            {children}
            {loading ? <Spinner /> : null}
        </button>
    )
}
