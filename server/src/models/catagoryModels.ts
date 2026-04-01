import mongoose, { model, Schema } from "mongoose";


export interface ICatagory extends Document {
    catagory: string;
    imagePath: string;
    products: mongoose.Types.ObjectId;
}

const catagorySchema = new Schema({
    catagory: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        // required: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, {
    timestamps: true
})

export const Catagory = model<ICatagory>("Catagory", catagorySchema)