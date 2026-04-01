import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import { useCreateCatagoryMutation, useUpdatedCatagoryMutation } from "@/store/catagorySlice";
import type { Catagory } from "@/types";

interface IDialog {
    open: boolean;
    setOpen: (value: boolean) => void;
    seleted: Catagory | null
}

const CreateCategory = ({ open, setOpen, seleted }: IDialog) => {
    const [createCategory, { isLoading }] = useCreateCatagoryMutation();
    const [updatedCatagory] = useUpdatedCatagoryMutation()
    const [category, setCategory] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    // 📁 File Change Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // ❌ Remove Image
    const removeImage = () => {
        setImage(null);
        setPreview("");
    };

    useEffect(() => {
        if (seleted) {
            setCategory(seleted.catagory);
            setPreview(seleted.imagePath);
        } else {
            setCategory("");
            setPreview("");
        }
    }, [seleted]);

    // 🚀 Submit Form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!category) {
            alert("Category name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("catagory", category);

            if (image) {
                formData.append("imagePath", image);
            }

            if (seleted) {
                await updatedCatagory({ id: seleted._id, formData }).unwrap()
            } else {

                await createCategory(formData).unwrap();
            }
            // Reset form
            setCategory("");
            setImage(null);
            setPreview("");
            setOpen(false);

        } catch (error) {
            console.log("Create Category Error:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-sm">
                <h2 className="text-center text-lg font-semibold">
                    Create Category
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 p-6">

                    {/* Upload Area */}
                    <Label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-violet-500 rounded-xl p-4 hover:bg-gray-50 transition">
                        <Upload className="h-10 w-10 text-gray-600" />
                        <span className="text-sm text-gray-500">
                            Click to upload image
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </Label>

                    {/* Preview */}
                    {preview && (
                        <div className="relative w-fit">
                            <img
                                src={preview}
                                alt="preview"
                                className="h-24 w-24 object-cover rounded-lg border"
                            />
                            <X
                                onClick={removeImage}
                                className="absolute top-1 right-1 h-5 w-5 cursor-pointer bg-black/50 text-white rounded-full p-1"
                            />
                        </div>
                    )}

                    {/* Category Input */}
                    <div className="space-y-2">
                        <Label>Category Name</Label>
                        <Input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category name..."
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full">
                        {isLoading ? "Creating..." : "Create Category"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategory;