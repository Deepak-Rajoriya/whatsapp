import Navbar from './Navbar';
import Sidebar from './SideBar'
import Main from './Main';

function Layout({ socket }) {
    return (
        <>
            <div className="layout overflow-hidden">
                <Navbar />
                <Sidebar />
                <Main socket={socket} />
            </div>
        </>
    );
}

export default Layout;