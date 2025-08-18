import { Router } from "express";
import {
	validateStartRegistration,
	startRegistration,
	validateLogin,
	login,
	getAllUsers,
	deleteUser,
	updateUserPut,
	updateUserPatch,
} from "../controller/auth.controller.js";

const router = Router();

// Registration route
router.post("/register", validateStartRegistration, async (req, res) => {
	try {
		await startRegistration(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Login route
router.post("/login", validateLogin, async (req, res) => {
	try {
		await login(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Get all users
router.get("/", async (req, res) => {
	try {
		await getAllUsers(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Delete a user
router.delete("/delete/:id", async (req, res) => {
	try {
		await deleteUser(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Update user (PUT)
router.put("/update/:id", async (req, res) => {
	try {
		await updateUserPut(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Update user (PATCH)
router.patch("/:id", async (req, res) => {
	try {
		await updateUserPatch(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
