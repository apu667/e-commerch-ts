import { useAppSelector } from "@/hook/hook"
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = () => {

    const user = useAppSelector(state => state.user.user);
    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoutes