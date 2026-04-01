import { Request, Response } from "express";
import { Order } from "../models/orderModels";
import { populate } from "dotenv";
import { AuthRequest } from "../types/types";
import { User } from "../models/userModels";



export const findAllOrder = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.product", // populate the "product" field inside each item of products array
        select: "name images price category", // only fields you want
      })
      .populate("user", "name email"); // optional: populate user info
    if (!orders || orders.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Order is not found"
      })
    }

    // Total revenue = sum of totalPrice of all orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Total shipments = total number of orders
    const totalShipments = orders.length;
    return res.status(201).json({
      sucess: true,
      message: "Order resive successFully",
      totalRevenue,
      totalShipments,
      orders
    })
  } catch (error) {
    console.log(error)
  }
}
export const userOrder = async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const order = await Order.find({ user: user?.userId });
  if (!order || order.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Order is not found"
    })
  }
  return res.status(201).json({
    success: true,
    message: "User al order get SuccessFully",
    order
  })
};