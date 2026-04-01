import express from "express"
import { allCatagory, catagoryProduct, createCatagory, deleteCatagory, updateCatagory } from "../controller/catagoryController";
import { upload } from "../middleware/multer";

export const catagoryRoutes = express.Router();
catagoryRoutes.post('/create', upload.single("imagePath"), createCatagory)
catagoryRoutes.get('/all', allCatagory)
catagoryRoutes.get('/product/:id', catagoryProduct)
catagoryRoutes.put("/update/:id", upload.single("imagePath"), updateCatagory);
catagoryRoutes.delete("/delete/:id", deleteCatagory);