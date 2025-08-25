import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  user: Types.ObjectId;
  amount: number;
  purpose: "registration" | "promotion" | "role-upgrade";
  status: "pending" | "approved" | "rejected";
  screenshot: string | string[];
  utrNumber?: string;
  approvedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;
  paymentMethod: "upi" | "account" | "whatsapp";   
  meta?: {
    requestedRole?: "broker" | "builder" | "owner";
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    purpose: {
      type: String,
      enum: ["registration", "promotion", "role-upgrade"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    screenshot: { type: Schema.Types.Mixed, required: true }, 
    utrNumber: { type: String, unique: true, sparse: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reason: { type: String },

    //  New field for payment method
    paymentMethod: {
      type: String,
      enum: ["upi", "account", "whatsapp"],
      required: false,
    },

    meta: {
      type: {
        requestedRole: {
          type: String,
          enum: ["broker", "builder", "owner"],
        },
      },
      default: {},
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;








