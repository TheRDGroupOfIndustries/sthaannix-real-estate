import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true }, // keep plain for OTP step, hash later
    createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 min
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
