// components/SheetCart.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hook/hook";
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from "@/base_url/base_url";

interface CartDialog {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetCart = ({ open, setOpen }: CartDialog) => {
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();


  const handleCheckout = async () => {
    try {
      const stripe = await loadStripe("pk_test_51R8LrJIEokk0O8lEfxYl8CAFDGaQXzqwkE91nB85mAMFCEe1T7Qa7gm851yZoY8MGBRRUmd9hbklQ65QPw921DgY002JOqkjc1");

      if (!stripe) throw new Error("Stripe failed to load");

      const { data } = await axios.post(
        `${BASE_URL}/api/product/create-checkout-session`,
        {
          type: "cart",
          products: cart
        }, {
        withCredentials: true,
      }
      );
      window.location.href = data.url; // <-- session.url

    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-87 sm:w-100">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4 px-4">
          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-xl shadow-sm"
            >
              <img
                className="h-16 w-16 rounded-lg object-cover"
                src={item.images}
                alt={item.name}
              />

              <div className="flex-1 px-3 flex flex-col justify-center">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="w-8 h-8 p-0 rounded-md flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => dispatch(incrementQuantity(item._id))}
                >
                  +
                </Button>
                <p className="w-5 text-center">{item.quantity}</p>
                <Button
                  className="w-8 h-8 p-0 rounded-md flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => dispatch(decrementQuantity(item._id))}
                >
                  -
                </Button>
              </div>

              <button
                className="ml-3 text-red-500 hover:text-red-700"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 px-4">
            <Button
              onClick={handleCheckout}
              className="w-full bg-violet-500 text-white py-2 rounded-lg">
              Proceed to Checkout (${cart.reduce((a, c) => a + c.price * c.quantity, 0)})
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SheetCart;