import { useState } from "react";
import CreateProduct from "@/components/admin/CreateProduct";
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
import { useDeleteProductMutation, useGetAllProductQuery } from "@/store/productSlice";
import { Pencil, Trash2 } from "lucide-react";
import { type products } from "@/types";

const Product = () => {
    const { data: products, isLoading } = useGetAllProductQuery();
    const [open, setOpen] = useState(false);
    const [seleted, setSeleted] = useState<products | null>(null);
    const [deleteProduct] = useDeleteProductMutation()


    const handleEdit = async (product: products) => {
        setSeleted(product);
        setOpen(true)
        console.log(product)
    }
    const handleDelete = async(id: string) => {
        await deleteProduct(id)
    }

    return (
        <div className="p-6">
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">All Products</h2>
                    <Button onClick={() => setOpen(true)}>Create Product</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading products...
                                </TableCell>
                            </TableRow>
                        ) : products && products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    {/* Product Info */}
                                    <TableCell className="flex items-center gap-3">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-md" />
                                        )}
                                        <span className="font-medium">{product.name}</span>
                                    </TableCell>

                                    <TableCell>{product.category?.catagory}</TableCell>

                                    <TableCell>${product.price}</TableCell>

                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${product.stock > 10
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {product.stock} pcs
                                        </span>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-3">
                                            <Pencil
                                                onClick={() => handleEdit(product)}
                                                className="cursor-pointer text-blue-500 hover:scale-110 transition" />
                                            <Trash2
                                                onClick={() => handleDelete(product._id)}
                                                className="cursor-pointer text-red-500 hover:scale-110 transition" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Create Product Modal */}
            <CreateProduct open={open} setOpen={setOpen} seleted={seleted} />
        </div>
    );
};

export default Product;