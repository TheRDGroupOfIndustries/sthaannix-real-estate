import express from "express";
import { login, register, verifyOtp,getAllUsers,deleteUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/all", getAllUsers);
router.delete("/delete/:id", deleteUser);

export default router;
