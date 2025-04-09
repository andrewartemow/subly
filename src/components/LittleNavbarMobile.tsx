import { FC } from "react"

interface LittleNavbarMobileProps {
    userEmail: string,
    onClick: () => void,
    openSettings: () => void
}

const LittleNavbarMobile: FC<LittleNavbarMobileProps> = ({ userEmail, onClick, openSettings }) => {
    return <div>
        <div tabIndex={0} role="button" className="btn m-1 bg-base-100 text-secondary">Menu</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" href="#">{userEmail}</a></li>
            <li><a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" href="#">Subscription Plan: <span className="p-2 rounded-lg bg-neutral-300 text-center">FREE</span></a></li>
            <li><a className="text-primary text-md font-bold p-2 mb-2 border-[1px] rounded-md" onClick={openSettings}>Settings</a></li>
            <li onClick={onClick}><a className="text-primary text-md font-bold p-2 mb-2 border-[1px] rounded-md" href="#">Log Out</a></li>
        </ul>
    </div>
}

export default LittleNavbarMobile