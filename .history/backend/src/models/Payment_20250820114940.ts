import mongoose from "mongoose";

export interface IPayment extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  purpose: "registration" | "promotion";
  status: "pending" | "approved" | "rejected";
  screenshot: string; 
  utrNumber?: string; // ✅new field
  approvedBy?: mongoose.Types.ObjectId; 
  reviewedAt?: Date;
  reason?: string;
}

const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, enum: ["registration", "promotion"], required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    screenshot: { type: String, required: true },
    utrNumber: { type: String, unique: true, sparse: true }, // ✅ Added field
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
