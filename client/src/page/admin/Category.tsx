import CreateCategory from "@/components/admin/CreateCategory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteCatagoryMutation, useGetAllCatagoryQuery } from "@/store/catagorySlice";
import type { Catagory } from "@/types";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const Category = () => {
  const [deleteCatagory] = useDeleteCatagoryMutation()
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useGetAllCatagoryQuery();
  const [seleted, setSeleted] = useState<Catagory | null>(null)


  if (isLoading) {
    return <>Loading....</>
  }
  const handleEdit = (catagory: Catagory) => {
    setSeleted(catagory);
    setOpen(true)
  }
  const handleDelete = async (id:string) => {
    await deleteCatagory({ id })
  }

  return (
    <div className="p-6">
      <Card className="p-4">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold mb-4">All Products</h2>
          <Button onClick={() => setOpen(true)}>Create Product</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((cat) => (
              <TableRow key={cat._id}>

                {/* Image */}
                <TableCell>
                  <img
                    src={cat.imagePath}
                    alt={cat.imagePath}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium">
                  {cat.catagory}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Pencil
                      onClick={() => handleEdit(cat)}
                      className="cursor-pointer text-blue-500 hover:scale-110 transition" />
                    <Trash2
                      onClick={() => handleDelete(cat._id)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition" />
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Card>
      <CreateCategory open={open} setOpen={setOpen} seleted={seleted} />
    </div>
  );
};

export default Category;