import { FC, ReactNode } from "react"

interface BlockProps {
    children: ReactNode,
    size?: "superSmall" | "small" | "medium" | "large"
    onClick?: () => void;
    onClickContext?: (argument?: any) => void // To fix later
}

const Block: FC<BlockProps> = ({ children, size, onClick, onClickContext }) => {

    let widthHeightProperties;

    switch (size) {
        case "superSmall":
            widthHeightProperties = "h-42 w-50"
            break;
        case "small":
            widthHeightProperties = "h-50 w-50"
            break;
        case "medium":
            widthHeightProperties = "h-82 w-96"
            break;
        default:
            widthHeightProperties = "h-68 w-68"
    }

    return <div className="relative">
        <div className={`bg-neutral-200 ${widthHeightProperties} rounded-lg border-[1px] border-neutral-400 cursor-pointer transform hover:scale-105 duration-75 overflow-hidden p-4`} onClick={onClick} onContextMenu={onClickContext}>
            {children}
        </div>
    </div>
}

export default Block