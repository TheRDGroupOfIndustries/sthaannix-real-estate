import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  user: Types.ObjectId;
  amount: number;
  purpose: "registration" | "promotion" | "role-upgrade";
  status: "pending" | "approved" | "rejected";
  screenshot: string;
  utrNumber?: string;
  approvedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;
  meta?: {
    requestedRole?: "broker" | "builder" | "owner";
  };
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
    screenshot: { type: String, required: true },
    utrNumber: { type: String, unique: true, sparse: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reason: { type: String },
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











// import mongoose from "mongoose";

// export interface IPayment extends mongoose.Document {
//   user: mongoose.Types.ObjectId;
//   amount: number;
//   purpose: "registration" | "promotion";
//   status: "pending" | "approved" | "rejected";
//   screenshot: string; 
//   utrNumber?: string; 
//   approvedBy?: mongoose.Types.ObjectId; 
//   reviewedAt?: Date;
//   reason?: string;
// }

// const PaymentSchema = new mongoose.Schema<IPayment>(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     amount: { type: Number, required: true },
//     purpose: { type: String, enum: ["registration", "promotion"], required: true },
//     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     screenshot: { type: String, required: true },
//     utrNumber: { type: String, unique: true, sparse: true }, // Added field
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     reviewedAt: { type: Date },
//     reason: { type: String },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IPayment>("Payment", PaymentSchema);
