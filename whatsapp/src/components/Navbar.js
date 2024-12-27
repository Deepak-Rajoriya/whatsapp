import React from 'react'
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navigation d-flex flex-column text-center navbar navbar-light hide-scrollbar">
            {/* <!-- Brand --> */}
            <Link to="/dashboard" title="Messenger" className="d-none d-xl-block mb-6">
                <svg version="1.1" width="46px" height="46px" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 46 46" enableBackground="new 0 0 46 46">
                    <polygon opacity="0.7" points="45,11 36,11 35.5,1 "></polygon>
                    <polygon points="35.5,1 25.4,14.1 39,21 "></polygon>
                    <polygon opacity="0.4" points="17,9.8 39,21 17,26 "></polygon>
                    <polygon opacity="0.7" points="2,12 17,26 17,9.8 "></polygon>
                    <polygon opacity="0.7" points="17,26 39,21 28,36 "></polygon>
                    <polygon points="28,36 4.5,44 17,26 "></polygon>
                    <polygon points="17,26 1,26 10.8,20.1 "></polygon>
                </svg>
            </Link>

            {/* <!-- Nav items --> */}
            <ul className="d-flex nav navbar-nav flex-row flex-xl-column flex-grow-1 justify-content-between justify-content-xl-center align-items-center w-100 py-4 py-lg-2 px-lg-3" role="tablist">

                {/* <!-- New chat --> */}
                <li className="nav-item">
                    <Link to="/dashboard/search" className="nav-link py-0 py-lg-8" title="Searh">
                        <div className="icon fs-1">
                        <i className="bi bi-search"></i>
                        </div>
                    </Link>
                </li>

                {/* <!-- Friends --> */}
                <li className="nav-item">
                    <Link to="/dashboard/chats" className="nav-link py-0 py-lg-8" title="Friends">
                        <div className="icon fs-1">
                        <i className="bi bi-chat"></i>
                        </div>
                    </Link>
                </li>

                {/* <!-- Notifications --> */}
                <li className="nav-item">
                    <Link to="/dashboard/notifications" className="nav-link py-0 py-lg-8">
                        <div className="icon fs-1">
                        <i className="bi bi-bell"></i>
                        </div>
                    </Link>
                </li>

                {/* <!-- Settings --> */}
                <li className="nav-item">
                    <Link to="/dashboard/settings" className="nav-link py-0 py-lg-8" title="Settings">
                        <div className="icon fs-1">
                        <i className="bi bi-gear"></i>
                        </div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar