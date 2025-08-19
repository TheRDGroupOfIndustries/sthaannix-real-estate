import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";
import { upload } from "../middlewares/multer";
import {
  getMyWallet,
  createTopUpRequest,
  listTopUpRequests,
  reviewTopUpRequest,
} from "../controllers/walletController";

const router = Router();

// user
router.get("/me", authenticate, getMyWallet);
router.post("/topup", authenticate, upload.single("proof"), createTopUpRequest);

// admin
router.get("/topups", authenticate, adminOnly, listTopUpRequests);
router.patch("/topups/:id", authenticate, adminOnly, reviewTopUpRequest);

export default router;
