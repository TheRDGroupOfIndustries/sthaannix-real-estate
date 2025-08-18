import { Router } from "express";
import multer from "multer";
import { submitPayment, validateSubmitPayment } from "../controller/payment.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Asynchronous route handler
router.post("/", upload.array("proofImages"), validateSubmitPayment, async (req, res) => {
	try {
		await submitPayment(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router; 