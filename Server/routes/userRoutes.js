import express from "express";
import { checkAuth, Login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/Auth.js";

const userRouter=express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",Login)
userRouter.put("/update-profile",protectRoute,updateProfile)
userRouter.get("/check",protectRoute,checkAuth)

export default userRouter;

