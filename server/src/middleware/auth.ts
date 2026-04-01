import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";

export const authorization: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: "user" | "admin";
    };

    (req as AuthRequest).user = decoded; // Type assertion
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};