import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useUpdateProfileMutation } from "@/store/authSlice";

interface IDialog {
    openPassword: boolean;
    setOpenPassword: (res: boolean) => void;
}

const ChangePassword = ({ openPassword, setOpenPassword }: IDialog) => {
    const [updateProfile] = useUpdateProfileMutation();

    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("oldPassword", data.oldPassword);
            formData.append("newPassword", data.newPassword);

            // Backend API call
            const response = await updateProfile(formData).unwrap();
            console.log(response)
            toast.success(response.message || "Password changed successfully!");
            setData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setOpenPassword(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    return (
        <Dialog open={openPassword} onOpenChange={setOpenPassword}>
            <DialogContent className="max-w-md">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    {/* Old Password */}
                    <div className="space-y-1">
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={data.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter your old password"
                        />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={data.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-2">
                        Update Password
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;