import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { IUser } from "@/types";
import { useUpdatedUserMutation } from "@/store/authSlice";

interface IDialog {
    open: boolean;
    setOpen: (value: boolean) => void;
    selected: IUser | null;
    onUpdated?: (user: IUser) => void; // optional callback after update
}

const UpdatedUser = ({ open, setOpen, selected, onUpdated }: IDialog) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"user" | "admin">("user");
    const [activeAccount, setActiveAccount] = useState(true);

    const [updatedUser, { isLoading, isError }] = useUpdatedUserMutation();

    // Fill form when a user is selected
    useEffect(() => {
        if (selected) {
            setName(selected.name);
            setEmail(selected.email);
            setRole(selected.role as "user" | "admin");
            setActiveAccount(selected.activeAccount);
        }
    }, [selected]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;

        try {
            const formData = {
                name,
                email,
                role,
                activeAccount,
            };

            const result = await updatedUser({ id: selected._id, formData }).unwrap();

            console.log("User updated:", result);

            // Optional callback to update parent state
            onUpdated && onUpdated(result);

            setOpen(false); // close modal
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edit User</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                </DialogHeader>

                <Card className="p-4">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex-1 space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                            />
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <Label>Role</Label>
                            <select
                                className="w-full border rounded p-2"
                                value={role}
                                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={activeAccount}
                                onChange={(e) => setActiveAccount(e.target.checked)}
                            />
                            <Label>Active Account</Label>
                        </div>

                        <Button type="submit" className="mt-2" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update"}
                        </Button>

                        {isError && <p className="text-red-500 text-sm">Update failed!</p>}
                    </form>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatedUser;