import { Router } from "express";
import * as user from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

// Get current user
router.get("/me", auth, async (req, res) => {
	try {
		await user.me(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Update current user (PATCH)
router.patch(
	"/updateme",
	auth,
	user.validateUpdateMe,
	async (req, res) => {
		try {
			await user.updateMe(req, res);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Server error" });
		}
	}
);

// Update current user (PUT) – full replacement or same as PATCH
router.put(
	"/updateme",
	auth,
	user.validateUpdateMe,
	async (req, res) => {
		try {
			await user.updateMe(req, res);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Server error" });
		}
	}
);

// Delete a user (Admin only)
router.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
	try {
		await user.adminDeleteUser(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router; 