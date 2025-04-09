import { FC } from 'react'
import { Link } from 'react-router';

import { MdOutlineSubscriptions, MdAttachMoney } from 'react-icons/md';

import CustomButton from './CustomButton';
import TextCard from './TextCard';


interface SideBarProps {
    onClick: (argument: "subscriptions" | "expences") => void;
}

const SideBar: FC<SideBarProps> = ({ onClick }) => {
    return (
        <div className="drawer-side w-72 bg-base-100">
            <div className="h-full flex flex-col justify-between items-center p-4">
                <ul className="menu bg-base-100 text-base-content w-full">
                    {/* Sidebar content here */}
                    <li className="hover:bg-neutral-100 p-1 rounded-md" onClick={() => onClick("subscriptions")}><a className="text-neutral-700 font-bold text-lg"><MdOutlineSubscriptions /> Subscriptions</a></li>
                    <li className="hover:bg-neutral-100 p-1 rounded-md" onClick={() => onClick("expences")}><a className="text-neutral-700 font-bold text-lg"><MdAttachMoney /> Expences</a></li>
                </ul>

                <div className="text-center flex flex-col items-center">
                    <p className="mb-4 text-secondary">Get <span className="font-bold">PRO</span> Plan by <TextCard backgroundColor="warning">💸price</TextCard> of coffee</p>
                    <Link to="/pricing">
                        <CustomButton>Change Subscription Plan</CustomButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SideBar