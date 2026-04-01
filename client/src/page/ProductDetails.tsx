// ProductDetails.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSingleProductQuery } from "@/store/productSlice";
import { useParams } from "react-router-dom";
import { addToCart } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import type { IProduct } from "@/types";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "@/hook/hook";
import Login from "@/components/desktop/Login";
import { BASE_URL } from "@/base_url/base_url";

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.user.user);

    const [openLogin, setOpenLogin] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // 🔥 API Call
    const {
        data: product,
        isLoading,
        isError,
    } = useGetSingleProductQuery({ id: id as string }, { skip: !id });

    // 🔥 Quantity Handler
    const handleQuantity = (type: "inc" | "dec") => {
        if (!product) return;

        if (type === "inc") setQuantity(prev => prev + 1);
        else setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    // 🔥 Total Price Real-time
    const totalPrice = product ? Number(product.price) * quantity : 0;

    // 🔥 Add to Cart
    const handleAddToCart = (product: IProduct) => {
        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                images: product.images[0],
                price: Number(product.price),
                quantity: quantity,
            })
        );
    };
    // 🔥 Stripe Checkout
    const handleCheckout = async () => {
        try {
            const stripe = await loadStripe(
                "pk_test_51R8LrJIEokk0O8lEfxYl8CAFDGaQXzqwkE91nB85mAMFCEe1T7Qa7gm851yZoY8MGBRRUmd9hbklQ65QPw921DgY002JOqkjc1"
            );

            if (!stripe) throw new Error("Stripe failed to load");

            const { data: session } = await axios.post(
                `${BASE_URL}/api/product/create-checkout-session`,
                {
                    type: "single",
                    product,
                    quantity,
                },
                {
                    withCredentials: true,
                }
            );

            // 🔥 Redirect to Stripe
            window.location.href = session.url;
        } catch (error: any) {
            console.error(error.message);
        }
    };

    // 🔥 UI Loading/Error
    if (!id) return <p>Invalid Product ID</p>;
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading product</p>;

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-10">
            {/* LEFT - Images */}
            <div className="flex-1">
                <img
                    src={product?.images?.[selectedImage]}
                    alt={product?.name}
                    className="w-full h-125 rounded-xl object-cover border"
                />

                <div className="flex mt-4 gap-4">
                    {product?.images?.map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`thumbnail-${idx}`}
                            className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === idx
                                ? "border-blue-600"
                                : "border-gray-300"
                                }`}
                            onClick={() => setSelectedImage(idx)}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT - Info */}
            <div className="flex-1 flex flex-col space-y-4">
                <h1 className="text-3xl font-bold">{product?.name}</h1>

                {/* Total Price */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-semibold text-green-600">
                        ${totalPrice}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-700">{product?.description}</p>

                {/* Quantity & Buttons */}
                <div className="flex items-center gap-4 mt-2">
                    {/* Quantity */}
                    <div className="flex items-center border rounded">
                        <Button onClick={() => handleQuantity("dec")}>-</Button>
                        <Input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-16 text-center border-none"
                        />
                        <Button onClick={() => handleQuantity("inc")}>+</Button>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        onClick={() => product && handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Add to Cart
                    </Button>

                    {/* Buy Now */}
                    {user ? (
                        <Button
                            onClick={handleCheckout}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Buy Now
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setOpenLogin(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Buy Now
                        </Button>
                    )}
                </div>

                {/* Stock */}
                <p className="text-gray-500 mt-2">
                    Stock Available: {product?.stock}
                </p>
            </div>

            {/* Login Modal */}
            <Login openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </div>
    );
};

export default ProductDetails;