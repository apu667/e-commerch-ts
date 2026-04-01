import { Request, Response } from "express"
import { User } from "../models/userModels"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { AuthRequest } from "../types/types"
import { uploadCloudinaryFileUpload } from "../utils/cloudinary"

export const SignUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    try {
        const extingUser = await User.findOne({ email });
        if (extingUser) {
            return res.status(401).json({
                success: false,
                message: "Email already exiting"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json({
            success: true,
            messsage: "User register successFully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}
export const SignIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email not exiting"
            })
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json({
            success: true,
            messsage: "User login successFully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const allUser = async (req: Request, res: Response) => {
    try {
        const user = await User.find();
        if (!user || user.length == 0) {
            return res.status(404).json({
                success: false,
                message: "User is not found"
            })
        }
        return res.status(201).json({
            success: false,
            message: "all user resived successFully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(201).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const updatedUser = async (req: Request, res: Response) => {
    const { name, email, role, activeAccount } = req.body;
    const userId = req.params.id
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not found"
            })
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (activeAccount) user.activeAccount = activeAccount;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "User updated successFully",
            user
        })
    } catch (error) {
        console.log(error)
    }
}

export const deletedUser = async (req: Request, res: Response) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not found"
            })
        }
        await User.findByIdAndDelete(userId);

        return res.status(201).json({
            success: true,
            message: "User delete successFully",
            user
        })
    } catch (error) {
        console.log(error)
    }
}
export const updatedUserProfile = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user
    const { name, email, oldPassword, newPassword } = req.body;
    const file = req.file?.path;
    const user = await User.findById(userId?.userId);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    if (name) user.name = name;
    if (email) {

        const findEmail = await User.findOne({ email });
        if (findEmail && findEmail._id.toString() !== userId?.userId) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        user.email = email; // <-- corrected
    }
    if (file) {
        const cloudImages = await uploadCloudinaryFileUpload({ path: file, folderName: "profileImg" });
        user.profilePic = cloudImages;
    }
    if (oldPassword) {
        const compare = await bcrypt.compare(oldPassword, user.password);
        if (!compare) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
    }
    await user.save();

    return res.status(201).json({
        success: true,
        message: "User Profile updated successFully",
        user
    })
}

export const logoutUser = async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        sameSite: "lax",      // lowercase!
        secure: false
    });

    res.status(200).json({ message: "Logout successful" });
};