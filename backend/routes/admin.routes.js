import express from "express";
import * as admin from "../controller/admin.controller.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.use(auth, requireRole("ADMIN"));

router.get("/pending", async (req, res) => {
	try {
		await admin.listPending(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/:id/approve", async (req, res) => {
	try {
		await admin.approveRegistration(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/:id/reject", async (req, res) => {
	try {
		await admin.rejectRegistration(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router; 