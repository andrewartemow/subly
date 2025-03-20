import { FC, ReactNode } from "react"

interface CustomButtonProps {
    children: ReactNode,
    size?: "default" | "big"
    type?: "submit" | "button"
    disabled?: boolean,
    onClick?: () => void;
}
const CustomButton: FC<CustomButtonProps> = ({ children, size = 'default', type = "button", disabled = false, onClick = () => { } }) => {
    return (
        <button className={`btn btn-secondary text-base-100 ${size === 'big' ? 'text-xl' : 'text-lg'} font-bold rounded-md`} type={type} disabled={disabled} onClick={onClick}>{children}</button>
    )
}

export default CustomButton