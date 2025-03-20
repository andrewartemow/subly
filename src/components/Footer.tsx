const Footer = () => {
    return <footer className="footer flex bg-base-100 border-neutral-300 border-t-[1px] text-secondary justify-center p-4">
        <aside className="grid-flow-col items-center">
            <p><strong>SUBLY</strong> Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
    </footer>
}

export default Footer