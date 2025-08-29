import express from "express";
import {
  login,
  register,
  verifyOtp,
  getAllUsers,
  deleteUser,
  requestRoleUpgrade,
  updateUserProfile,
  getUserById,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword,
  getUserWalletBalance
} from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/send-otp", sendPasswordResetOTP);
router.post("/verify-pass-otp", verifyPasswordResetOTP);
router.post("/reset", resetPassword);

router.get("/all", getAllUsers);
router.delete("/delete/:id", deleteUser);

router.get("/get-by-id/:id", authenticate, getUserById);

router.post(
  "/role-upgrade",
  authenticate, 
  upload.single("proof"),
  requestRoleUpgrade
);

router.put("/profile", authenticate, updateUserProfile);

router.get("/:id/wallet", authenticate, getUserWalletBalance);

export default router;
