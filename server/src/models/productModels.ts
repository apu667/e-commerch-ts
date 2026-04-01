import mongoose, { Schema, Document } from "mongoose";


export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number; // base quantity
  category: mongoose.Types.ObjectId;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    images: [{ type: String }],
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Catagory", required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);