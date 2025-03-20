import { FC, ReactNode } from "react"

interface LittleNavbarProps {
    children: ReactNode,
}

const LittleNavbar: FC<LittleNavbarProps> = ({ children }) => {
    return <div className={`fixed z-50 top-0 right-0 p-2 border-[1px] border-neutral-200 rounded-bl-xl bg-base-100`}>
        {children}
    </div>
}

export default LittleNavbar