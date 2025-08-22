import express from "express";
import { login, register, verifyOtp,getAllUsers,deleteUser ,requestRoleUpgrade} from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/all", getAllUsers);
router.delete("/delete/:id", deleteUser);


router.post(
  "/role-upgrade",
  authenticate,          // ensure user is logged in
  upload.single("proof"),  
  requestRoleUpgrade
);

router.put("/profile", authMiddle, updateUserProfile);

export default router;
