import mongoose from "mongoose";

export const dataBaseConnection = async () => {
    const dbUrl = process.env.MONGODB_URI
    try {
        if (!dbUrl) return;
        await mongoose.connect(dbUrl);
        console.log("DataBase is connection successFully")
    } catch (error) {
        console.log("DataBase connection failed")
    }
}