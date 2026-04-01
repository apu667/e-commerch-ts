// types/types.ts
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: { userId: string; role: "user" | "admin" }; // JWT থেকে decoded
}