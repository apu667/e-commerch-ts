import { Request, Response } from "express";
import { Product } from "../models/productModels";
import { uploadCloudinaryFileUpload } from "../utils/cloudinary";

import { ApiVersion } from "stripe/types/apiVersion";
import Stripe from "stripe";
import { Order } from "../models/orderModels";
import { AuthRequest } from "../types/types";
import { Catagory } from "../models/catagoryModels";

// Create Product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;



    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }
    const catagorys = await Catagory.findById(category);
    if (!catagorys) {
      res.status(404).json({
        success: false,
        message: "Catagory is not found"
      })
      return;
    }


    // Upload images if any
    const uploadedImages: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadCloudinaryFileUpload({ path: file.path, folderName: "E-CommerchImg" });
        uploadedImages.push(url);
      }
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    // Create product
    const product = await Product.create({
      name,
      description,
      price: priceNumber,
      stock: stockNumber,
      category: catagorys._id,
      images: uploadedImages,

    });

    res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

// Get All Products
export const findAllProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "catagory imagePath"
    });
    if (!products.length) {
      res.status(404).json({ success: false, message: "No products found" });
      return;
    }
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Single Product
export const singleProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Product retrieved successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Product
export const updatedProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  const files = req.files as Express.Multer.File[] | undefined;
  const { name, description, price, stock, category } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);
    if (category) product.category = category;

    // Upload new images if any
    if (files && files.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files) {
        const url = await uploadCloudinaryFileUpload({ path: file.path, folderName: "E-CommerchImg" });
        uploadedImages.push(url);
      }
      product.images = uploadedImages;
    }


    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const fillterProduct = async (req: Request, res: Response) => {
  const { category, size, minPrice, maxPrice, q } = req.body;
  try {
    const filter: any = {};

    // Category filter
    if (category && category.length > 0) {
      filter.category = category
    }

    // Size filter
    if (size && size.length > 0) {
      filter.size = size
    }
    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }


    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string;
}

export const createCheckout = async (req: Request, res: Response) => {
  const { type, product, products, quantity } = req.body;
  const user = (req as AuthRequest).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let line_items: any[] = [];

    // ✅ SINGLE PRODUCT
    if (type === "single") {
      if (!product) {
        return res.status(400).json({ message: "Product required" });
      }

      line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.images?.[0]], // safe
            },
            unit_amount: product.price * 100,
          },
          quantity: quantity > 0 ? quantity : 1,
        },
      ];
    }

    // ✅ CART PRODUCTS
    if (type === "cart") {
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products must be array" });
      }

      line_items = products.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: Array.isArray(item.images)
              ? [item.images[0]]
              : [item.images], // fix nested issue
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity > 0 ? item.quantity : 1,
      }));
    }

    // ❌ type wrong
    if (!type || line_items.length === 0) {
      return res.status(400).json({ message: "Invalid checkout data" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      shipping_address_collection: {
        allowed_countries: ["BD"],
      },

      phone_number_collection: {
        enabled: true,
      },

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",

      metadata: {
        userId: user.userId,
        type,
        quantity: quantity.toString(), // ✅
        product: type === "single" ? JSON.stringify(product) : "",
        products: type === "cart" ? JSON.stringify(products) : "",
      },
    });

    res.json({ url: session.url });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



