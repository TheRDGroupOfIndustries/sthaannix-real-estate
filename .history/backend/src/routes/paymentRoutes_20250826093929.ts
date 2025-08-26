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
import multer from "multer";

const router = Router();

// User routes
router.post(
  "/submit-proof",
  authenticate,
  (req, res, next) => {
    upload.array("proof", 5)(req, res, (err) => { // 👈 allow up to 5 files
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "File upload failed" });
      }
      next();
    });
  },
  uploadPaymentProof
);



// route for person who paid to see their payment
router.get("/my-payments", authenticate, getMyPayments);

router.delete("/history/:type/:id", authenticate, deletePaymentHistory);


// Admin routes
router.get("/admin/all", authenticate, adminOnly, getAllPayments);
router.patch("/admin/approve/:id", authenticate, adminOnly, approvePayment);
router.patch("/admin/reject/:id", authenticate, adminOnly, rejectPayment);

export default router;
 