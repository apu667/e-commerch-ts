import { clearCart } from "@/store/cartSlice";
import { CheckCircle } from "lucide-react"; // or react-icons
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Success = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch])

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">
          Your transaction was completed successfully. Thank you for your purchase!
        </p>
        <button
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          onClick={() => window.location.href = "/"} // or navigate using React Router
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;