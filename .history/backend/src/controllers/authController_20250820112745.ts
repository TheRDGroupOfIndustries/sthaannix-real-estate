import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import Otp from "../models/Otp";
import { sendOTP } from "../utils/emailService";
import { generateToken } from "../utils/generateToken";

// ---------------- REGISTER ----------------
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const generatedOTP = generateOTP().toString();

    await Otp.create({ email, otp: generatedOTP });
    await sendOTP(email, generatedOTP);

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: (error as Error).message, message: "Server error" });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Full Body:", req.body);
    const { email, otp, name, role, phone, password } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const validOtp = await Otp.findOne({ email, otp: otp.toString() });
    console.log("🔍 OTP Record:", validOtp);

    if (!validOtp) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // Set status according to role
    let status: "pending" | "approved" | "rejected" = "approved"; // default for regular users
    if (["broker", "builder", "owner"].includes(role.toLowerCase())) {
      status = "pending"; // pending approval/payment
    }

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      phone,
      role,
      isVerified: true,
      status, 
    });

    await Otp.deleteMany({ email });

    res.status(200).json({
      message:
        status === "pending"
          ? "User registered successfully. Please complete the registration payment."
          : "User registered successfully.",
      user,
    });
  } catch (error) {
    console.error("VerifyOtp Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- LOGIN ----------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const token = generateToken(payload);

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (req: Request, res: Response) => {
  try {
   
    const users = await User.find().select("-password"); 
    // `.select("-password")` removes password field for security

    res.status(200).json({
      message: "All registered users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
