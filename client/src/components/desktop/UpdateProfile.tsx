import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateProfileMutation } from "@/store/authSlice";
import { useAppSelector } from "@/hook/hook";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

interface IDialog {
    open: boolean;
    setOpen: (res: boolean) => void;
}

interface UserData {
    name: string;
    email: string;
}

const UpdateProfile: React.FC<IDialog> = ({ open, setOpen }) => {
    const user = useAppSelector((state) => state.user.user);
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch=useDispatch()
    const [data, setData] = useState<UserData>({
        name: "",
        email: "",
    });
    const [images, setImages] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    // Auto-fill form when user data is available
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || "",
                email: user.email || "",
            });
            if (user.profilePic) setPreview(user.profilePic);
        }
    }, [open]);

    // Cleanup for object URL
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Input change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // File select handler
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImages(file);
        setPreview(URL.createObjectURL(file));
    };

    // Remove selected image
    const handleDelete = () => {
        setImages(null);
        setPreview("");
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);

        if (images) formData.append("profilePic", images);

        try {
            const res = await updateProfile(formData).unwrap();
            setOpen(false);
            console.log(res)
            dispatch(setUser(res.user))
            // Reset state
            setData({ name: "", email: "" });
            setImages(null);
            setPreview("");
        } catch (err) {
            console.error("Profile update failed:", err);
            // Optional: show toast/error message
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div className="flex items-center justify-center w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="flex-col w-full py-6 space-y-4"
                    >
                        {/* Upload Section */}
                        <Label className="border border-dashed rounded-xl border-violet-500 p-4 flex flex-col items-center justify-center bg-black/5 cursor-pointer">
                            <div className="border p-3 rounded-full bg-black/10">
                                <Upload />
                            </div>
                            <p>Click to upload image</p>
                            <input
                                name="profilePic"
                                type="file"
                                className="hidden"
                                onChange={handleFile}
                            />
                        </Label>

                        {/* Preview Image */}
                        {preview && (
                            <div className="flex items-center">
                                <div className="flex-col relative">
                                    <X
                                        onClick={handleDelete}
                                        size={18}
                                        className="absolute right-0 h-8 cursor-pointer"
                                    />
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-24 h-24 rounded-full mt-3 object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!data.name && !data.email && !images} // optional
                        >
                            Update
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfile;