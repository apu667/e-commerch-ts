import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface IFileTypes {
    path: string;
    folderName: string
}

export const uploadCloudinaryFileUpload = async ({ path, folderName }: IFileTypes): Promise<string> => {
    try {
        const uploadResult = await cloudinary.uploader.upload(path, {
            folder: folderName
        })
        try {
            fs.unlinkSync(path);
            console.log("Local server to images deleted successFully")
        } catch (error) {
            console.log("local server to images is not deleted")
            console.log(error)
        }
        return uploadResult.secure_url;
    } catch (error) {
        console.log("Cloudinary Error:", error);
        throw new Error("Upload failed");
    }
}