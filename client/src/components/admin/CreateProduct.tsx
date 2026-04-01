import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCatagoryQuery } from "@/store/catagorySlice";
import type { Catagory, products } from "@/types";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/productSlice";

interface IDialogBox {
  open: boolean;
  setOpen: (value: boolean) => void;
  seleted: products | null;
}

const CreateProduct = ({ open, setOpen, seleted }: IDialogBox) => {
  const { data: categories } = useGetAllCatagoryQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]); // for edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Category select
  const handleCategorySelect = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  // Handle image upload
  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const totalFiles = images.concat(selectedFiles).slice(0, 5); // max 5
    setImages(totalFiles);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Remove old image
  const handleRemoveOldImage = (index: number) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  // Load selected product for editing
  useEffect(() => {
    if (seleted) {
      setFormData({
        name: seleted.name || "",
        description: seleted.description || "",
        price: String(seleted.price) || "",
        stock: String(seleted.stock) || "",
        category: seleted.category?._id || "",
      });
      setOldImages(seleted.images || []);
      setImages([]);
    } else {
      setFormData({ name: "", description: "", price: "", stock: "", category: "" });
      setImages([]);
      setOldImages([]);
    }
  }, [seleted]);

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);

    images.forEach((img) => data.append("images", img));
    oldImages.forEach((img) => data.append("oldImages", img)); // keep old images

    try {
      if (seleted) {
        await updateProduct({ id: seleted._id, formData: data }).unwrap();
      } else {
        await createProduct(data).unwrap();
      }

      // reset
      setFormData({ name: "", description: "", price: "", stock: "", category: "" });
      setImages([]);
      setOldImages([]);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>{seleted ? "Update Product" : "Create New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <Label className="flex flex-col items-center justify-center border border-dashed border-violet-500 rounded-xl p-6 bg-black/5 cursor-pointer">
              <div className="border bg-black/10 shadow p-4 rounded-full mb-2">
                <Upload />
              </div>
              <p>Click to upload images (max 5)</p>
              <Input
                type="file"
                multiple
                onChange={handleImg}
                className="hidden"
                accept="image/*"
              />
            </Label>

            {/* Old Images */}
            <div className="flex flex-wrap gap-2 mt-2">
              {oldImages.map((url, index) => (
                <div key={index} className="relative w-20 h-20 rounded overflow-hidden border">
                  <img src={url} alt={`old-${index}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveOldImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* New Images */}
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => {
                const url = URL.createObjectURL(img);
                return (
                  <div key={index} className="relative w-20 h-20 rounded overflow-hidden border">
                    <img src={url} alt={`preview-${index}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Inputs */}
          <div className="flex flex-col space-y-2">
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name..." />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description..." />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Price</Label>
            <Input name="price" value={formData.price} onChange={handleChange} placeholder="Enter product price..." />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Stock</Label>
            <Input name="stock" value={formData.stock} onChange={handleChange} placeholder="Enter product quantity..." />
          </div>

          <div className="flex flex-col space-y-2">
            <Select onValueChange={handleCategorySelect} value={formData.category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories?.map((cat: Catagory) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.catagory}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{seleted ? "Update Product" : "Create Product"}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;