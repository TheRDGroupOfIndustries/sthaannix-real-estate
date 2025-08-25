import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true }, // store as string to preserve leading 0s
    name: { type: String }, // only required for registration
    phone: { type: String },
    role: { 
      type: String, 
      enum: ["buyer", "broker", "builder", "owner", "admin", "user"], 
      default: "user" 
    },
    password: { type: String }, 
    purpose: { 
      type: String, 
      enum: ["registration", "password-reset"], 
      default: "registration" 
    },
    createdAt: { type: Date, default: Date.now, expires: 300 } // expires after 5 min
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
