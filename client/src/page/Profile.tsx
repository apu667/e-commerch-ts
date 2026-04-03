import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector, useAppDispatch } from "@/hook/hook";
import { useGetUserOrderQuery } from "@/store/orderSlice";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import UpdateProfile from "@/components/desktop/UpdateProfile";
import ChangePassword from "@/components/desktop/ChnagePassword";
import { BASE_URL } from "@/base_url/base_url";
import { setUser } from "@/store/userSlice";
import { useUserProfileQuery } from "@/store/authSlice";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("My orders");
  const [open, setOpen] = useState<boolean>(false);
  const [openPassword, setOpenPassword] = useState<boolean>(false);

  // User info from Redux
  const user = useAppSelector((state) => state.user.user);

  // Orders query
  const { data: ordersData, isLoading } = useGetUserOrderQuery();
  const orders = ordersData || [];

  // Google login handling
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  // Fetch profile from backend (optional)
  const { data: profileData } = useUserProfileQuery({});

  useEffect(() => {
    // If profileData exists, set Redux user
    if (profileData) {
      dispatch(setUser(profileData));
    }
  }, [profileData, dispatch]);

  const profileList = [
    { id: 1, name: "My orders" },
    { id: 3, name: "Login & security" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-xl font-bold mb-5">My Account</h2>
          <ul className="flex flex-col gap-3">
            {profileList.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveTab(item.name)}
                className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                  activeTab === item.name
                    ? "bg-orange-500 text-white shadow"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 space-y-6">
          {/* Orders */}
          {activeTab === "My orders" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>

              {isLoading ? (
                <p>Loading...</p>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orders.map((order: any) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-semibold text-gray-600">
                            #{order._id?.slice(-6) ?? "000000"}
                          </TableCell>

                          <TableCell>
                            {order.products?.length > 0 ? (
                              order.products.map((p: any) => (
                                <div
                                  key={p._id}
                                  className="flex items-center gap-3"
                                >
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover border"
                                    src={p.product?.images?.[0] ?? "/placeholder.png"}
                                    alt={p.product?.name ?? "Product"}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {p.product?.name ?? "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {p.quantity ?? 0}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No products</p>
                            )}
                          </TableCell>

                          <TableCell className="font-semibold">
                            ${order.totalPrice ?? 0}
                          </TableCell>

                          <TableCell>
                            <span
                              className={`px-3 py-1 text-sm rounded-full font-medium ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {order.paymentStatus ?? "pending"}
                            </span>
                          </TableCell>

                          <TableCell className="text-sm text-gray-600">
                            {order.address?.street ?? ""},{" "}
                            {order.address?.city ?? ""},{" "}
                            {order.address?.country ?? ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>No orders yet.</p>
              )}
            </div>
          )}

          {/* Profile / Security */}
          {activeTab === "Login & security" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold">Profile</h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.profilePic ?? "/avatar-placeholder.png"} />
                    <AvatarFallback>
                      {user?.name?.slice(0, 1)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-lg font-semibold">{user?.name ?? "Unknown"}</p>
                    <p className="text-gray-500">{user?.email ?? "email@example.com"}</p>
                  </div>
                </div>

                <div>
                  <Edit onClick={() => setOpen(true)} />
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p>
                  <strong>Password:</strong> ********
                </p>

                <button
                  onClick={() => setOpenPassword(true)}
                  className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Change Password
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-2"
                >
                  SignIn with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UpdateProfile open={open} setOpen={setOpen} />
      <ChangePassword
        openPassword={openPassword}
        setOpenPassword={setOpenPassword}
      />
    </div>
  );
};

export default Profile;