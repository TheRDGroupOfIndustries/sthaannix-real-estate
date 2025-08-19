import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";
import {
  uploadPaymentProof,
  getMyPayments,
  approvePayment,
  rejectPayment,
  getAllPayments,
} from "../controllers/paymentController";
import { upload } from "../middlewares/multer";

const router = Router();

// User routes
router.post("/submit-proof", authenticate, upload.single("proof"), uploadPaymentProof);
router.get("/my", authenticate, getMyPayments);

// Admin routes
router.get("/all", authenticate, adminOnly, getAllPayments);
router.patch("/approve/:id", authenticate, adminOnly, approvePayment);
router.patch("/reject/:id", authenticate, adminOnly, rejectPayment);

export default router;