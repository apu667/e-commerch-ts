import express, { Request, Response } from "express";
import { allUser, deletedUser, logoutUser, SignIn, SignUp, updatedUser, updatedUserProfile, userProfile } from "../controller/userController";
import passport from "passport";
import { authorization } from "../middleware/auth";
import { upload } from "../middleware/multer";

export const router = express.Router();

router.post("/auth/signup", SignUp);
router.post("/auth/signin", SignIn);
router.post("/auth/logout", authorization, logoutUser);

router.get("/auth/profile", authorization, userProfile);
router.post("/auth/profile/update", authorization, upload.single("profilePic"), updatedUserProfile);
router.post("/auth/profile/update", authorization, upload.single("profilePic"), updatedUserProfile);
router.get("/auth/all", allUser);
router.put("/auth/updated/:id", updatedUser);
router.delete("/auth/delete/:id", deletedUser);


router.get("/test", (req, res) => {
  res.send("Router is working!");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) return res.redirect("/login");

    // Safe cast to any
    const { token } = req.user as any;

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(process.env.FRONTEND_URL || "https://e-commerch-ts-ud3i.vercel.app");
  }
);