// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { signToken } from "../middleware/auth.js";
import db from "../client/connect.js";

// Validators
export const validateStartRegistration = [
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("phone").trim().notEmpty(),
  body("role")
    .customSanitizer((value) => value.toUpperCase()) // convert input to uppercase
    .isIn(["BROKER", "BUILDER", "PROPERTY_OWNER", "ADMIN", "USER"])
    .withMessage("Invalid role"),
];

// Step 1: Start registration (creates RegistrationRequest)
// Admins skip payment and become real users immediately.
export const startRegistration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role } = req.body;
    console.log("Registration request body:", { name, email, phone, role });

    try {
        const hashed = await bcrypt.hash(password, 10);

        if (role === "ADMIN") {
            console.log("Creating admin user...");
            const user = await db.user.create({
                data: { name, email, password: hashed, phone, role },
            });
            console.log("Admin created:", user);

            const token = signToken(user);
            console.log("Token generated:", token);

            return res.status(201).json({ message: "Admin registered", user, token });
        }

        console.log("Creating registration request for non-admin...");
        const request = await db.registrationRequest.create({
            data: { name, email, password: hashed, phone, role },
        });
        console.log("RegistrationRequest created:", request);

        res.status(201).json({
            message: "Registration started. Please complete the payment.",
            requestId: request.id,
        });
    } catch (e) {
        console.error("Registration error:", e);
        if (e && e.code === "P2002") {
            return res.status(409).json({ message: "Email already in use" });
        }
        return res.status(500).json({ message: "Server error", error: e.message });
    }
};

// Login validators
export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Login controller
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (only for ADMIN)
export const getAllUsers = async (req, res) => {
  try {
    // if (!req.user || req.user.role !== "ADMIN") {
    //   return res.status(403).json({ message: "Forbidden: Admins only" });
    // }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Attach token for each user
    const usersWithToken = users.map((user) => ({
      ...user,
      token: signToken(user),
    }));

    res.json({ users: usersWithToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "User not found" });
  }
};

// Update user (PUT - replace all fields)
export const updateUserPut = async (req, res) => {
  const { id } = req.params;
  let { name, email, phone, password, role } = req.body; // <-- use let instead of const

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    if (role) role = role.toUpperCase(); 

    const user = await db.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        role,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    res.json({ message: "User updated successfully", user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// Update user (PATCH - partial update)
export const updateUserPatch = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
	if (role) role = role.toUpperCase(); 

    const user = await db.user.update({
      where: { id },
      data,
    });

    res.json({ message: "User updated successfully", user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
