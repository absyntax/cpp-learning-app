type SidebarProps = {
    activeMenu: string;
    onMenuSelect: (menu: string) => void;
};

function Sidebar({
    activeMenu,
    onMenuSelect
}: SidebarProps) {
    const menuItems = [
        "Content Management",
        "User Management",
        "Ad Management",
        "Communication",
        "Analytics"
    ];

    return (
        <aside>
            <h2>C++ Learning App</h2>

            <nav>
                {menuItems.map((item) => (
                   <button
    key={item}
    type="button"
    onClick={() => onMenuSelect(item)}
    disabled={item !== "Content Management"}
    aria-current={activeMenu === item ? "page" : undefined}
>
                        {item}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;