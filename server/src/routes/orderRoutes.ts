import express from "express"
import { findAllOrder, userOrder } from "../controller/orderController";
import { authorization } from "../middleware/auth";
export const orderRoutes = express.Router();
orderRoutes.get('/all', findAllOrder)
orderRoutes.get('/userOrder',authorization,userOrder)
