import { NavLink } from 'react-router-dom';

import logo from '/logo.svg'

const Header = () => {
    return (
        <header className="py-4 border-b-[1px] border-neutral-300">
            <div className="container mx-auto flex px-4 justify-between items-center">
                <NavLink to="/"><img src={logo} className="w-30 mr-4" alt="logo" /></NavLink>
                <div className="dropdown dropdown-bottom dropdown-end md:hidden">
                    <div tabIndex={0} role="button" className="btn m-1 bg-base-100 text-secondary">Menu</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><NavLink className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" to="/pricing">Pricing</NavLink></li>
                        <li><NavLink className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" to="/login">Log in</NavLink></li>
                        <li><NavLink className="text-primary text-md font-bold p-2 border-[1px] rounded-md" to="/signup">Get Started For Free</NavLink></li>
                    </ul>
                </div>
                <nav className="hidden md:flex flex-1 justify-between">
                    <ul className="flex gap-x-6 items-center">
                        {/* <li><a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md" href="#">Product</a></li> */}
                        <li><NavLink className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md" to="/pricing">Pricing</NavLink></li>
                    </ul>
                    <ul className="flex items-center gap-x-6">
                        <li><NavLink className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md" to="/login">Log in</NavLink></li>
                        <li><NavLink className="text-primary text-md font-bold p-2 border-[1px] rounded-md" to="/signup">Get Started For Free</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header