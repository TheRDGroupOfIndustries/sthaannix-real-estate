import prisma from "../client/connect.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

// Get current logged-in user
export const me = async (req, res) => {
	try {
		if (!req.user) return res.status(401).json({ message: "Unauthorized" });
		res.json({ user: req.user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Validation rules for updating user
export const validateUpdateMe = [
	body("name").optional().isString(),
	body("phone").optional().isString(),
	body("password").optional().isLength({ min: 6 }),
];

// Update user details (PATCH or PUT)
export const updateMe = async (req, res) => {
	try {
		if (!req.user) return res.status(401).json({ message: "Unauthorized" });

		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		// List of fields users are allowed to update
		const allowedFields = ["name", "phone", "email", "password"];
		const data = {};

		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				data[field] = req.body[field];
			}
		}

		// Hash password if provided
		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		const user = await prisma.user.update({
			where: { id: req.user.id },
			data,
		});

		res.json({ user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Admin: Delete any user
export const adminDeleteUser = async (req, res) => {
	try {
		await prisma.user.delete({ where: { id: req.params.id } });
		res.json({ message: "User deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(404).json({ message: "User not found" });
	}
}; 