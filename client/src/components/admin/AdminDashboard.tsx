import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DollarSign, ShoppingCart, Truck } from "lucide-react";
import { ChartExample } from "./ProductChart";
import { useGetAllOrderQuery } from "@/store/orderSlice";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAllOrderQuery();
  console.log(data)
  if (isLoading) return <div>Loading...</div>;

  const orders = data?.orders || [];
  console.log(orders)
  // Calculate Avg Order
  const avgOrder =
    orders.length > 0
      ? Math.round(
        orders.reduce((acc, order) => acc + order.totalPrice, 0) /
        orders.length
      )
      : 0;

  const totalRevenue = data?.totalRevenue || 0;
  const totalShipments = data?.totalShipments || 0;

  // 🎨 Status Color
  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-yellow-100 text-yellow-600";
    if (status === "failed" || status === "cancelled") return "bg-red-100 text-red-600";
    return "";
  };

  return (
    <div className="p-6 space-y-8">

      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition">
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRevenue}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Last 3 months</p>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Avg Order</CardTitle>
            <ShoppingCart className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${avgOrder}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Last 3 months</p>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Shipment</CardTitle>
            <Truck className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalShipments}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Last 3 months</p>
          </CardFooter>
        </Card>
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartExample />

        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
          <p className="text-gray-500">Add Line Chart here</p>
        </Card>
      </div>

      {/* 🔹 Recent Orders Table */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.slice(0, 5).map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id}</TableCell>

                <TableCell className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {order.user?.name?.charAt(0)}
                  </div>
                  {order.user?.name}
                </TableCell>

                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>

                <TableCell>{"N/A"}</TableCell>

                <TableCell className="text-right font-semibold">
                  ${order.totalPrice}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right font-bold">
                ${orders.reduce((acc, order) => acc + order.totalPrice, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboard;