// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dataBaseConnection = async () => {
    const dbUrl = process.env.MONGODB_URI;
    console.log("Trying to connect to DB:", dbUrl);

    if (!dbUrl) {
        console.log("❌ MONGODB_URI not found in .env");
        return;
    }

    try {
        await mongoose.connect(dbUrl);
        console.log("✅ Database connected successfully");
    } catch (error: any) {
        console.log("❌ Database connection failed:");
        console.error(error.message); // full error message for debug
    }
};