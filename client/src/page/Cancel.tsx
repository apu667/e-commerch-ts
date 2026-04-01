
import { XCircle } from "lucide-react"; // or react-icons

const Cancel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <XCircle className="mx-auto text-red-500 w-16 h-16" />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">Payment Canceled</h1>
        <p className="mt-2 text-gray-600">
          Your transaction was not completed. You can try again or return to the home page.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => window.location.href = "/checkout"} // retry
          >
            Try Again
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={() => window.location.href = "/"} // home
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;