import { FC, ReactNode } from "react"

interface BlockProps {
    children: ReactNode,
    size?: "small" | "medium" | "large"
    onClick?: () => void;
}

const Block: FC<BlockProps> = ({ children, size, onClick }) => {

    let widthHeightProperties;

    switch (size) {
        case "small":
            widthHeightProperties = "h-52 w-72"
            break;
        case "medium":
            widthHeightProperties = "h-82 w-96"
            break;

        default:
            widthHeightProperties = "h-68 w-68"
    }

    return (
        <div className={`bg-neutral-200 ${widthHeightProperties} rounded-lg border-[1px] border-neutral-400 cursor-pointer transform hover:scale-105 duration-75 overflow-hidden p-4`} onClick={onClick}>
            {children}
        </div>
    )
}

export default Block