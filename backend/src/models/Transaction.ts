import mongoose, { Schema, Document } from "mongoose";

export type TopUpStatus = "pending" | "approved" | "rejected";

export interface ITopUpRequest extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  proofUrl: string;               
  status: TopUpStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;               
}

const TopUpRequestSchema = new Schema<ITopUpRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    proofUrl: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITopUpRequest>("TopUpRequest", TopUpRequestSchema);
