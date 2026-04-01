import { Request, Response } from "express"
import { Catagory } from "../models/catagoryModels";
import { uploadCloudinaryFileUpload } from "../utils/cloudinary";
import path from "path";
import { Product } from "../models/productModels";



export const createCatagory = async (req: Request, res: Response) => {
    const { catagory } = req.body;
    const file = req.file?.path;
    try {
        if (!catagory || !file) {
            return res.status(401).json({
                success: false,
                message: "Catagory is required"
            })
        }
        const cloudImg = await uploadCloudinaryFileUpload({ path: file, folderName: "CatagoryImg" })
        const catagorys = await Catagory.create({
            catagory,
            imagePath: cloudImg
        })
        return res.status(201).json({
            success: true,
            message: "catagory created successFully",
            catagorys
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            sucess: false,
            message: "Internal server error"
        })
    }
}

export const allCatagory = async (req: Request, res: Response) => {
    try {
        const catagory = await Catagory.find();
        if (!catagory || catagory.length == 0) {
            res.status(401).json({
                success: false,
                message: "Catagory is not found"
            })
        }
        return res.status(201).json({
            success: true,
            message: "All catagory found",
            catagory
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const updateCatagory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { catagory } = req.body;
    const file = req.file?.path;

    try {
        const existing = await Catagory.findById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (catagory) existing.catagory = catagory;
        if (file) {
            const cloudImg = await uploadCloudinaryFileUpload({ path: file, folderName: "CatagoryImg" });
            existing.imagePath = cloudImg;
        }
        const updated = await existing.save()

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            updated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteCatagory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existing = await Catagory.findById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Catagory.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const catagoryProduct = async (req: Request, res: Response) => {
    const catagoryId = req.params.id;

    try {
        const catagory = await Catagory.findById(catagoryId);

        if (!catagory) {
            return res.status(404).json({
                success: false,
                message: "Category is not found"
            });
        }

        // ✅ এখানে find ব্যবহার করতে হবে
        const products = await Product.find({ category: catagoryId });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in this category"
            });
        }

        return res.status(200).json({
            success: true,
            message: "All category products received",
            products
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};