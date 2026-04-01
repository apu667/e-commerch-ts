import { Button } from "@/components/ui/button";
import { addToCart } from "@/store/cartSlice";
import { useGetProductsByCategoryQuery } from "@/store/catagorySlice";
import type { CartItem } from "@/types";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const Catagory = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const { data } = useGetProductsByCategoryQuery(id!);



    const handleAddToCart = (product: CartItem) => {
        dispatch(addToCart({
            _id: product._id,        // যদি _id না থাকে, name use করা যাবে কিন্তু unique হোক
            name: product.name,
            images: product.images[0],  // main image
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
                                className="h-44 w-full object-cover"
                                src={items.images[0]}
                                alt=""
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
    );
};
export default Catagory;