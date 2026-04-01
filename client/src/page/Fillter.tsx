import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllCatagoryQuery } from "@/store/catagorySlice";
import { useFilterProductMutation } from "@/store/productSlice";
import type { Product, SizeType, Catagory } from "@/types";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
const Filter = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false)
    const { name } = useParams();
    const [category, setCategory] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [price, setPrice] = useState<[number, number]>([0, 2000]);
    const [products, setProducts] = useState<Product[]>([]);
    const { data: catData } = useGetAllCatagoryQuery();
    const [filterProduct] = useFilterProductMutation();

    const sizeOptions: SizeType[] = [
        { id: 1, name: "M" },
        { id: 2, name: "L" },
        { id: 3, name: "XL" },
        { id: 4, name: "XXL" },
    ];

    // Handlers
    const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) setCategory([...category, value]);
        else setCategory(category.filter((item) => item !== value));
    };

    const handleSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) setSizes([...sizes, value]);
        else setSizes(sizes.filter((item) => item !== value));
    };

    const handlePrice = (value: [number, number]) => setPrice(value);

    // Fetch filtered products
    const fetchFilteredProducts = async () => {
        try {
            const body = {
                category: category,   // array
                size: sizes,          // array
                minPrice: price[0],
                maxPrice: price[1],
                q: name || "",
            };
            console.log(body)
            const res: any = await filterProduct(body).unwrap();
            setProducts(res.products)
        } catch (err) {
            console.error("Filter fetch error:", err);
        }
    };

    useEffect(() => {
        fetchFilteredProducts();
    }, [category, sizes, price, name]);

    return (
        <div className="bg-gray-100 pt-4 px-3">
            <Button
                onClick={() => setOpen(true)}
                className="md:hidden w-full mb-4 flex justify-between items-center">
                <span>Filter</span>
                <FilterIcon className="w-5 h-5" />
            </Button>
            <div className="max-w-7xl mx-auto px-6 w-full flex bg-white p-6 h-screen gap-10">
                {/* Sidebar */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent side="left">
                        <div className="w-full border-r flex-col p-6 space-y-4">
                            <h3 className="text-sm font-bold">Category</h3>
                            {catData?.map((item: Catagory) => (
                                <div key={item._id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={item._id}
                                        onChange={handleCategory}
                                    />
                                    <Label>{item.catagory}</Label>
                                </div>
                            ))}

                            <h3 className="text-sm font-bold">Size</h3>
                            {sizeOptions.map((item) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <input type="checkbox" value={item.name} onChange={handleSize} />
                                    <Label>{item.name}</Label>
                                </div>
                            ))}

                            <h3 className="text-sm font-bold">Price</h3>
                            <Slider
                                defaultValue={[0, 2000]}
                                max={2000}
                                step={100}
                                onValueChange={handlePrice}
                            />
                            <p className="text-sm">
                                ${price[0]} - ${price[1]}
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>
                {/* Desktop Sidebar */}
                <div className="w-full md:w-1/4 border-r flex-col p-6 space-y-4 hidden md:block">
                    <h3 className="text-sm font-bold">Category</h3>
                    {catData?.map((item: Catagory) => (
                        <div key={item._id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={item._id}
                                onChange={handleCategory}
                            />
                            <Label>{item.catagory}</Label>
                        </div>
                    ))}

                    <h3 className="text-sm font-bold">Size</h3>
                    {sizeOptions.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <input type="checkbox" value={item.name} onChange={handleSize} />
                            <Label>{item.name}</Label>
                        </div>
                    ))}

                    <h3 className="text-sm font-bold">Price</h3>
                    <Slider
                        defaultValue={[0, 2000]}
                        max={2000}
                        step={100}
                        onValueChange={handlePrice}
                    />
                    <p className="text-sm">
                        ${price[0]} - ${price[1]}
                    </p>
                </div>

                {/* Products */}
                <div className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {products.length > 0 ? (
                            products.map((item: Product) => (
                                <div
                                    key={item._id}
                                    className="rounded-lg overflow-hidden flex-col bg-gray-100"
                                >
                                    <img
                                        className="h-44 w-full bg-cover bg-center cursor-pointer"
                                        src={item.images[0]}
                                        alt={item.name}
                                        onClick={() => navigate(`/product/${item._id}`)}
                                    />
                                    <div className="flex-col p-3">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p>$ {item.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full mt-10">
                                No products found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;