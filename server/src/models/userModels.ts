import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  activeAccount: boolean;
  role: "admin" | "user";
}

const userSchema: Schema<IUser> = new Schema(
  {
    googleId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true 
    },
    profilePic: {
      type: String,
      default: ""
    },
    activeAccount: {
      type: Boolean,
      default: true
    },
    role: {
      type: String, // <-- type missing before
      enum: ["admin", "user"], // restrict to these values
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>("User", userSchema);