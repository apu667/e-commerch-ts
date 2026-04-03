import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SheetCart from "./SheetCart";
import Login from "./Login";
import { useAppSelector } from "@/hook/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();



  const cart = useAppSelector((i) => i.cart.cart);
  const user = useAppSelector((state) => state.user.user);

  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const handleSearchBar = () => {
    if (search) {
      navigate(`/fillter/${search}`);
    } else {
      navigate(`/`);
    }
  };

  const handleLogout = async () => {
    dispatch(setUser(null));
    await logout().unwrap();
  };

  return (
    <header className="bg-black text-gray-100 shadow-md">
      {/* Top Navbar */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <h3 className="text-2xl font-bold italic">
            <span className="text-orange-400">E</span>-commerch
          </h3>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 mx-6">
          <div className="flex items-center justify-center max-w-lg mx-auto relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-700 text-gray-950 bg-gray-100 placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Search products..."
            />
            <Button
              onClick={handleSearchBar}
              className="absolute right-3 flex items-center justify-center top-1"
            >
              <Search className="w-5 h-5 font-bold" />
            </Button>
          </div>
        </div>

        {/* Actions: Login/User + Cart */}
        <div className="flex items-center gap-6">
          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.profilePic || ""} />
                  <AvatarFallback>{user.name.slice(0, 1).toUpperCase() || "N/A"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setOpenLogin(true)}
              className="bg-violet-500 hover:bg-violet-600 transition px-6 py-2 text-lg rounded-full"
            >
              Login
            </Button>
          )}

          {/* Cart */}
          <div
            onClick={() => (user ? setOpen(true) : setOpenLogin(true))}
            className="relative cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6 text-gray-100" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 py-2">
        <div className="flex items-center justify-center relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-700 text-gray-950 bg-gray-100 placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Search products..."
          />
          <Button
            onClick={handleSearchBar}
            className="absolute right-3 flex items-center justify-center top-1"
          >
            <Search className="w-5 h-5 font-bold" />
          </Button>
        </div>
      </div>

      {/* Cart Sheet & Login Modal */}
      <SheetCart open={open} setOpen={setOpen} />
      <Login openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </header>
  );
};

export default Navbar;