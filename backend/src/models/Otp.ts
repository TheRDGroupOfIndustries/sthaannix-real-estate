import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: false },
    role: { 
      type: String, 
      enum: ["buyer", "broker", "builder", "owner", "admin", "user"], 
      default: "user" 
    },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, 
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
