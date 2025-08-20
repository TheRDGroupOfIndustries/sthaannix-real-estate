import express from "express";
import { login, register, verifyOtp,get } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/all", getAllUsers);

export default router;
