import { useState } from "react";
import Sidebar from "./Sidebar";
import ContentManagement from "./ContentManagement";

function App() {
    const [activeMenu, setActiveMenu] =
        useState("Content Management");

    return (
        <div>
            <Sidebar
                activeMenu={activeMenu}
                onMenuSelect={setActiveMenu}
            />

            <main>
                {activeMenu === "Content Management" && (
                    <ContentManagement />
                )}
            </main>
        </div>
    );
}

export default App;