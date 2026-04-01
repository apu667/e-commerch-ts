import { Outlet } from "react-router-dom";
import Navbar from "../desktop/Navbar";

const StoreLayout = () => {
    return (
        <>
            <Navbar /> {/* user navbar */}
            <Outlet />
        </>
    );
};

export default StoreLayout;