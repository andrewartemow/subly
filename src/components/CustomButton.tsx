import { FC, ReactNode } from "react"

interface CustomButtonProps {
    children: ReactNode,
    size?: "default" | "big" | "small",
    type?: "submit" | "button"
    backgroundColor?: "info" | "warning" | "error" | "success"
    disabled?: boolean,
    onClick?: () => void;
}
const CustomButton: FC<CustomButtonProps> = ({ children, size, type = "button", backgroundColor, disabled = false, onClick = () => { } }) => {

    let bgProperty;
    let sizeProperty;

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
            break;

        default:
            bgProperty = "bg-primary"
    }

    switch (size) {
        case "big":
            sizeProperty = "text-xl"
            break;

        case "small":
            sizeProperty = "text-md"
            break;

        default:
            sizeProperty = "text-lg"
    }

    return (
        <button className={`btn ${bgProperty} btn-secondary text-base-100 ${sizeProperty} font-bold rounded-md`} type={type} disabled={disabled} onClick={onClick}>{children}</button>
    )
}

export default CustomButton