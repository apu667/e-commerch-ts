import { Outlet } from "react-router-dom";
import LeftSideBar from "../admin/LeftSideBar";

const AdminLayout = () => {
    return (
        <div className="w-full flex gap-8 px-6">
            <div className="w-1/8 border-r h-screen">
                <LeftSideBar />
            </div>
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;