import UpdatedUser from "@/components/admin/UpdatedUser";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllUserQuery, useDeletedUserMutation } from "@/store/authSlice";
import type { IUser } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const Users = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [seleted, setSeleted] = useState<IUser | null>(null)
  const { data, } = useAllUserQuery();
  const [deletedUser] = useDeletedUserMutation()


  const getStatusColor = (activeAccount: boolean) => {
    return activeAccount
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  const handleUpdated = async (user: IUser) => {
    setSeleted(user)
    setOpen(true)
  }
  const handleDelete = async (id: string) => {
    await deletedUser(id)
  }

  return (
    <div className="p-6">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">All Users</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((user) => (
              <TableRow key={user._id}>
                {/* Avatar + Name */}
                <TableCell className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(user.activeAccount)}`}
                  >
                    {user.activeAccount ? "Active" : "Inactive"}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Pencil
                      onClick={() => handleUpdated(user)}
                      className="cursor-pointer text-blue-500 hover:scale-110 transition" />
                    <Trash2
                      onClick={() => handleDelete(user._id)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <UpdatedUser
        open={open}
        setOpen={setOpen}
        selected={seleted} // ✅ change 'seleted' to 'selected'
      />
    </div>
  );
};

export default Users;