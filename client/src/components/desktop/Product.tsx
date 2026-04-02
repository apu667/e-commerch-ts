import { useGetAllProductQuery } from "@/store/productSlice"
import { Button } from "../ui/button"
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import type { CartItem } from "@/types";
import { useNavigate } from "react-router-dom";


const Product = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetAllProductQuery()
    const navigate = useNavigate()
    if (isLoading) {
        return <p>Loading...</p>
    }


    const handleAddToCart = (product: CartItem) => {
        dispatch(addToCart({
            _id: product._id,        
            name: product.name,
            images: product.images[0], 
            price: product.price,
            quantity: 1,
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-6 bg-white p-6 flex-col space-y-3">
            <p className="text-lg font-bold">Product</p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {
                    data?.map((items: any) => (
                        <div
                            key={items._id}
                            className="rounded-lg overflow-hidden flex-col bg-gray-100">

                            <img
                                className="h-44 w-full object-cover cursor-pointer"
                                src={items.images[0]}
                                alt="images"
                                onClick={() => navigate(`/product/${items._id}`)}
                            />

                            <div className="flex-col p-3 space-y-2">
                                <p className="text-sm font-medium">
                                    {items.name}
                                </p>
                                <p>$ {items.price}</p>
                                <Button
                                    onClick={() => handleAddToCart(items)}
                                    className="w-full bg-violet-500">Add to Cart</Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Product