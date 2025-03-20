import { FC, ReactNode } from "react"

interface DescriptionProps {
    size?: "default" | "big",
    children: ReactNode
}

const Description: FC<DescriptionProps> = ({ children, size = 'default' }) => {
    return <p className={`py-6 ${size === "big" ? "text-2xl" : "text-lg"} text-secondary`}>
        {children}
    </p>
}

export default Description