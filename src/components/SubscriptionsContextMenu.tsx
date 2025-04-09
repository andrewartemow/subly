import { FC, useRef, useEffect } from "react"

import { HiArrowNarrowRight } from "react-icons/hi";
import { IoIosAttach } from "react-icons/io";
// import { CiStickyNote } from "react-icons/ci";


interface SubscriptionsContextMenuProps {
    x: number,
    y: number,
    websiteLink: string,
    closeContextMenu: () => void,
    openModalAttachFile: () => void,
}

const SubscriptionsContextMenu: FC<SubscriptionsContextMenuProps> = ({ x, y, websiteLink, closeContextMenu, openModalAttachFile }) => {

    const menuRef = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close menu if clicked outside or left-click is detected
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeContextMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeContextMenu]);

    return (
        <div ref={menuRef} className="absolute z-20 bg-base-100 p-2 rounded-lg border-[1px] border-neutral-300" style={{ top: `${y}px`, left: `${x}px` }}>
            <ul className="text-secondary flex flex-col gap-y-2">

                <li className="flex items-center gap-x-4 p-2 hover:bg-info rounded-lg cursor-pointer hover:text-base-100 transform duration-75">
                    <a href={websiteLink} target="_blank" className="w-full flex items-center gap-x-4">
                        <HiArrowNarrowRight className="text-md" /><span className="text-md">Go to Website</span>
                    </a>
                </li>

                <li className="flex items-center gap-x-4 p-2 hover:bg-warning rounded-lg cursor-pointer hover:text-base-100 transform duration-75" onClick={openModalAttachFile}>
                    <IoIosAttach className="text-md" /><span className="text-md">Attach File</span>
                </li>
                {/* <li className="flex items-center gap-x-4 p-2 hover:bg-success rounded-lg cursor-pointer hover:text-base-100 transform duration-75">
                    <a href={websiteLink} target="_blank" className="w-full flex items-center gap-x-4">
                        <CiStickyNote className="text-md" /><span className="text-md">Add Note</span>
                    </a>
                </li> */}
            </ul>
        </div >
    )
}

export default SubscriptionsContextMenu;