import React from "react";
import { Outlet } from "react-router-dom";

function SideBar() {
    return (
        <aside className="sidebar bg-light">
            <div className="tab-content h-100" role="tablist">
                <Outlet />
            </div>
        </aside>
    );
}

export default SideBar