import mongoose, { Schema, Document } from "mongoose";

export type TopUpStatus = "pending" | "approved" | "rejected";

export interface ITopUpRequest extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  proof: string[];
  status: TopUpStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;
  utrNumber?: string; // Optional UTR number
  paymentMethod: "upi" | "account" | "whatsapp"; 
  createdAt: Date;
  updatedAt: Date;
}

const TopUpRequestSchema = new Schema<ITopUpRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
   proof: { type: [String], required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reason: { type: String },
    utrNumber: {
      type: String,
      unique: true,
      sparse: true,
      minlength: 12,
      maxlength: 22,
      match: /^[A-Za-z0-9]+$/, 
    },
       //  New field for payment method
    paymentMethod: {
      type: String,
      enum: ["upi", "account", "whatsapp"],
      required: false,
    },
  },
  { timestamps: true }
);

const TopUpRequest =
  mongoose.models.TopUpRequest ||
  mongoose.model<ITopUpRequest>("TopUpRequest", TopUpRequestSchema);

export default TopUpRequest;
