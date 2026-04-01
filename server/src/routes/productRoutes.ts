import express, { RequestHandler } from "express"

import { createCheckout, createProduct, deleteProduct, fillterProduct, findAllProduct, singleProduct, updatedProduct } from "../controller/productController";
import { authorization } from "../middleware/auth";
import { upload } from "../middleware/multer";

export const productRoutes = express.Router();
productRoutes.post("/create", upload.array("images", 5), createProduct);
productRoutes.get("/all", findAllProduct);
productRoutes.post("/filter", fillterProduct);
productRoutes.get("/:id", singleProduct);
productRoutes.put("/update/:id", updatedProduct);
productRoutes.delete("/delete/:id", deleteProduct);

productRoutes.post("/create-checkout-session", authorization, createCheckout)
