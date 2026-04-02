import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dataBaseConnection } from "./config/db";
import { router } from "./routes/authRoutes";
import passport from "passport";

dotenv.config();
import "./utils/GoogleStrategy";
import { productRoutes } from "./routes/productRoutes";
import Stripe from "stripe";
import { Order } from "./models/orderModels";
import { orderRoutes } from "./routes/orderRoutes";
import { catagoryRoutes } from "./routes/catagoryRoutes";

dataBaseConnection();

const app = express();
const PORT = process.env.PORT || 8080;

// ------------------------------
// Stripe Webhook: ONLY raw body
// ------------------------------

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) return res.sendStatus(400);

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        let products: any[] = [];

        if (type === "single") {
          const singleProduct = JSON.parse(session.metadata?.product || "{}");
          products = [
            {
              ...singleProduct,
              quantity: Number(session.metadata?.quantity || 1),
            },
          ];
        }

        if (type === "cart") {
          products = JSON.parse(session.metadata?.products || "[]").map((p: any) => ({
            ...p,
            quantity: Number(p.quantity || 1),
          }));
        }

        if (!userId || products.length === 0) {
          console.log("❌ Missing userId or products");
          return res.sendStatus(400);
        }

        const totalPrice = products.reduce((sum, item) => {
          const price = Number(item.price);
          const qty = Number(item.quantity);
          return sum + price * qty;
        }, 0);

        const totalQuantity = products.reduce((sum, item) => sum + Number(item.quantity), 0);

        const stripeAddress = session.customer_details?.address;

        const orderData = {
          user: userId,
          products: products.map((p) => ({
            product: p._id || p,
            quantity: Number(p.quantity),
          })),
          totalQuantity,
          totalPrice,
          paymentStatus: "paid",
          address: {
            street: stripeAddress?.line1 || "Default Street",
            city: stripeAddress?.city || "Dhaka",
            state: stripeAddress?.state || "",
            country: stripeAddress?.country || "BD",
            postalCode: stripeAddress?.postal_code || "0000",
          },
        };

        const order = await Order.create(orderData);
        console.log("✅ Order created:", order._id);
      }

      res.sendStatus(200);
    } catch (err: any) {
      console.log("❌ Webhook Error:", err.message);
      res.sendStatus(400);
    }
  }
);

// ------------------------------
// Normal middlewares for all other routes
// ------------------------------
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ------------------------------
// Routes
// ------------------------------
app.use("/api", router);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/category", catagoryRoutes);



// ------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});