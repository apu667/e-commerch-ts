import { useGetAllCatagoryQuery } from "@/store/catagorySlice";
// import type { Categorys } from "@/types"
import { Link } from "react-router-dom"

const Category = () => {
     const { data } = useGetAllCatagoryQuery();
  
    return (
        <div className="bg-white max-w-7xl mx-auto px-6 p-6 flex-col space-y-2">
            <h1 className="text-lg font-bold">Category</h1>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-7">
                {
                    data?.map((items) => (
                        <Link
                            to={`/catagory/${items._id}`}
                            key={items._id}
                            className=" bg-gray-100 p-4 rounded-xl">
                            <img
                                className="w-auto h-8 md:h-16 object-cover rounded-md mx-auto"
                                src={items.imagePath}
                                alt={items.catagory}
                            />
                            <p className="text-xs md:text-sm font-medium text-center">{items.catagory}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Category