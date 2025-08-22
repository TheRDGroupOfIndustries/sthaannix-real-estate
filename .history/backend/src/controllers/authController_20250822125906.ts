import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import Otp from "../models/Otp";
import { sendOTP } from "../utils/emailService";
import { generateToken } from "../utils/generateToken";
import Payment from "../models/Payment";
import { uploadFile } from "../utils/uploadToCloudinary";

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
};

//  REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, password } = req.body;

    const strength = calculatePasswordStrength(password);
    if (strength < 100) {
      return res.status(400).json({
        message:
          "Weak password. Must be at least 8 chars, include uppercase, lowercase, and a number.",
        strength,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const generatedOTP = generateOTP().toString();

    await Otp.create({
      email,
      otp: generatedOTP,
      name,
      phone,
      role: role.toLowerCase(),
      password, // plain password for now (will hash after OTP verified)
    });

    await sendOTP(email, generatedOTP);

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(500)
      .json({ error: (error as Error).message, message: "Server error" });
  }
};

//VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const validOtp = await Otp.findOne({ email, otp: otp.toString() });
    if (!validOtp) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    const { name, phone, role, password } = validOtp; // take stored values

    const hashedPass = await bcrypt.hash(password.toString(), 10);

    let status: "pending" | "approved" | "rejected" = "approved";
    if (["broker", "builder", "owner"].includes(role.toLowerCase())) {
      status = "pending";
    }

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      phone,
      role: role.toLowerCase(),
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

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account first" });
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
      status: user.status,
    };

    const token = generateToken(payload);

    //  Build a safe response object
    const responseUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      walletBalance: user.walletBalance,
      status: user.status,
    };

    res.json({ token, user: responseUser });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "All registered users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER 
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// upgrade role Controller.ts
export const requestRoleUpgrade = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { newRole, amount, utrNumber, proof } = req.body;
    const validRoles = ["broker", "builder", "owner"];

    if (!validRoles.includes(newRole.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (amount < 1500) {
      return res.status(400).json({ message: "Role upgrade fee is ₹1500" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "user") {
      return res.status(400).json({ message: "Only normal users can request upgrade" });
    }

    let screenshot = "";
    if (req.file) {
      const uploaded = await uploadFile(req.file.buffer, "payments/proofs");
      screenshot = uploaded.secure_url;
    } else if (proof) {
      screenshot = proof;
    } else {
      return res.status(400).json({ message: "Proof image required" });
    }

    const payment = await Payment.create({
      user: user._id,
      amount,
      purpose: "role-upgrade",
      utrNumber,
      screenshot,
      status: "pending",
      meta: { requestedRole: newRole.toLowerCase() },
    });

    res.status(201).json({ 
      message: "Role upgrade payment proof submitted. Waiting for admin approval.", 
      payment 
    });
  } catch (error) {
    console.error("RoleUpgrade Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


//UPDATE NAME,EMAIL,PASS
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Update allowed fields only
    if (name) user.name = name;
    if (email) {
      // check if email already taken
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        walletBalance: user.walletBalance,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("UpdateUserProfile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};









// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     if (!user.isVerified) {
//       return res
//         .status(403)
//         .json({ message: "Please verify your account first" });
//     }

//     const isMatch = await bcrypt.compare(password.toString(), user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const payload = {
//       id: user._id.toString(),
//       role: user.role,
//       email: user.email,
//     };

//     const token = generateToken(payload);

//     res.json({ token, role: user.role });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };