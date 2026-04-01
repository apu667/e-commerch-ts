import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllOrderQuery } from "@/store/orderSlice";
import { Trash2, Truck } from "lucide-react";

const Orders = () => {
  const { data, isLoading } = useGetAllOrderQuery();
  const orders = data?.orders || [];
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="p-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Orders</h2>
          <Button>Export Orders</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell>{order.user?.name}</TableCell>
                  <TableCell>
                    {order.products.map((pro: any) => (
                      <div key={pro._id} className="flex items-center gap-2">
                        {pro.product?.images?.[0] ? (
                          <img
                            className="h-10 w-auto rounded-full"
                            src={pro.product.images[0]}
                            alt={pro.product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            N/A
                          </div>
                        )}
                        <p>{pro.product?.name || "Product deleted"} x {pro.quantity}</p>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.totalQuantity}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "failed" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <Truck
                        className="cursor-pointer text-blue-500 hover:scale-110 transition"
                        onClick={() => setSelectedOrder(order)}
                      />
                      <Trash2 className="cursor-pointer text-red-500 hover:scale-110 transition" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-3xl relative max-h-[85vh] overflow-y-auto shadow-lg">

            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            {/* Customer Info */}
            <div className="mb-6 space-y-2">
              <h3 className="font-semibold text-lg">Customer Info</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6 space-y-2">
              <h3 className="font-semibold text-lg">Address</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Street:</strong> {selectedOrder.address?.street}</p>
                <p><strong>City:</strong> {selectedOrder.address?.city}</p>
                <p><strong>State:</strong> {selectedOrder.address?.state || "N/A"}</p>
                <p><strong>Country:</strong> {selectedOrder.address?.country}</p>
                <p><strong>Postal Code:</strong> {selectedOrder.address?.postalCode}</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Products</h3>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selectedOrder.products.map((pro: any) => (
                    <TableRow key={pro._id}>
                      <TableCell>
                        <img
                          className="h-10 w-10 object-cover rounded-md"
                          src={pro.product.images[0]}
                          alt={pro.product.name}
                        />
                      </TableCell>

                      <TableCell>{pro.product.name}</TableCell>
                      <TableCell>{pro.product.category}</TableCell>
                      <TableCell>{pro.quantity}</TableCell>
                      <TableCell>${pro.product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Order Summary */}
            <div className="mb-6 space-y-2">
              <h3 className="font-semibold text-lg">Order Summary</h3>

              <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
              <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>

              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${selectedOrder.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : selectedOrder.paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;