import { FC, useRef, useEffect } from "react"

import { MdDelete } from "react-icons/md";


interface FilesContextMenu {
    x: number,
    y: number,
    closeContextMenu: () => void,
    deleteClickedAttachedFile: () => void
}

const FilesContextMenu: FC<FilesContextMenu> = ({ x, y, closeContextMenu, deleteClickedAttachedFile }) => {

    const fileRef = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close menu if clicked outside or left-click is detected
            if (fileRef.current && !fileRef.current.contains(event.target as Node)) {
                closeContextMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeContextMenu]);

    return (
        <div ref={fileRef} className="absolute z-20 bg-base-100 p-2 rounded-lg border-[1px] border-neutral-300" style={{ top: `${y}px`, left: `${x}px` }}>
            <ul className="text-secondary flex flex-col gap-y-2">

                <li className="flex items-center gap-x-4 p-2 hover:bg-error rounded-lg cursor-pointer hover:text-base-100 transform duration-75" onClick={() => {
                    deleteClickedAttachedFile();
                    closeContextMenu();
                }
                }>
                    <MdDelete className="text-md" /><span className="text-md">Delete File</span>
                </li>

            </ul>
        </div >
    )
}

export default FilesContextMenu;