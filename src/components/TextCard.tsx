import { FC, ReactNode } from "react"

interface TextCardProps {
    children: ReactNode,
    rotate?: "2" | "-2",
    backgroundColor: "info" | "error" | "warning" | "success"
}

const TextCard: FC<TextCardProps> = ({ children, backgroundColor, rotate }) => {

    let bgProperty;
    let rotateProperty;

    switch (rotate) {
        case "-2":
            rotateProperty = 'rotate-[-2deg]'
            break;

        case "2":
            rotateProperty = 'rotate-[2deg]'
            break;

        default:
            rotateProperty = 'rotate-[0deg]'
    }


    switch (backgroundColor) {
        case "info":
            bgProperty = "bg-info"
            break;

        case "error":
            bgProperty = "bg-error"
            break;

        case "warning":
            bgProperty = "bg-warning"
            break;

        case "success":
            bgProperty = "bg-success"
    }

    return <span className={`${bgProperty} inline-block rounded-xl text-base-100 px-1 font-medium py-2 border-4 border-gray-300 cursor-pointer ${rotateProperty} transform hover:scale-105 duration-75`}>{children}</span>
}

export default TextCard;