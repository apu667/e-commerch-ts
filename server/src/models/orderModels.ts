import mongoose, { Schema, Document, Types } from "mongoose";

// 1️⃣ Interface for Order
export interface IOrderProduct {
  product: Types.ObjectId; // Product ID
  quantity: number;
  price: number;
  images: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId; // User ID
  products: IOrderProduct[]; // Multiple products
  totalQuantity: number; // Total quantity of all products
  totalPrice: number; // Total price of all products
  paymentStatus: "pending" | "paid" | "failed";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// 2️⃣ Mongoose Schema
const orderSchema: Schema<IOrder> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Array of products with quantity and price
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: String, requred: true }
      },
    ],

    // Total quantity of all products
    totalQuantity: { type: Number, required: true, default: 1 },

    totalPrice: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    address: {
      street: { type: String },
      city: { type: String, },
      state: { type: String },
      country: { type: String, },
      postalCode: { type: String, },
    },
  },
  { timestamps: true }
);

// 3️⃣ Export Model
export const Order = mongoose.model<IOrder>("Order", orderSchema);