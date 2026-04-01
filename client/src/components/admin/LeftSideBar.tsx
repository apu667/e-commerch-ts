import { Home, Package, LayoutGrid, Users, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeftSideBar = () => {
    const navigate = useNavigate();

    const adminProduct = [
        {
            id: 1,
            name: "Home",
            icon: <Home size={20} />,
            path: "/admin"
        },
        {
            id: 2,
            name: "Product",
            icon: <Package size={20} />,
            path: "/admin/products"
        },
        {
            id: 3,
            name: "Category",
            icon: <LayoutGrid size={20} />,
            path: "/admin/category"
        },
        {
            id: 4,
            name: "User",
            icon: <Users size={20} />,
            path: "/admin/users"
        },
        {
            id: 5,
            name: "Order",
            icon: <Boxes size={20} />,
            path: "/admin/order"
        },
    ];

    return (
        <div className="flex flex-col h-screen  text-black w-full p-4">

            {/* Logo */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-violet-400">
                    E-commerce
                </h3>
            </div>

            {/* Menu */}
            <div className="flex flex-col space-y-3">
                {adminProduct.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:text-white
                        hover:bg-violet-600 transition-all duration-200"
                    >
                        <span>{item.icon}</span>
                        <p className="text-md font-medium">{item.name}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default LeftSideBar;