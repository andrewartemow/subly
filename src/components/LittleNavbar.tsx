import { FC } from "react"

interface LittleNavbarProps {
    userEmail: string,
    avatarUrl: string,
    onClick: () => void,
    openSettings: () => void
}

const LittleNavbar: FC<LittleNavbarProps> = ({ userEmail, avatarUrl, onClick, openSettings }) => {
    return <div className={`fixed z-50 top-0 right-0 p-2 border-[1px] border-neutral-200 rounded-bl-xl bg-base-100`}>
        <div className="flex flex-col items-start">
            <div className="flex items-center mb-4">
                <div className="avatar">
                    <div className="w-10 rounded-xl">
                        <img src={avatarUrl} />
                    </div>
                </div>
                <p className="font-medium text-secondary p-1">{userEmail}</p>
            </div>

            <p className="font-medium text-secondary p-1">Subscription Plan: <span className="p-2 rounded-lg bg-neutral-300">FREE</span></p>
            <a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md cursor-pointer" onClick={openSettings}>Settings</a>
            <a className="text-info text-md font-medium hover:bg-blue-100 p-1 rounded-md cursor-pointer" onClick={onClick}>Log Out</a>
        </div>
    </div>
}

export default LittleNavbar