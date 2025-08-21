import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import Otp from "../models/Otp";
import { sendOTP } from "../utils/emailService";
import { generateToken } from "../utils/generateToken";

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
      role,
      password, // plain password for now (will hash after OTP verified)
    });

    await sendOTP(email, generatedOTP);

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: (error as Error).message, message: "Server error" });
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

// LOGIN
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
    };

    const token = generateToken(payload);

    // 👇 Build a safe response object
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
