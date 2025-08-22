import mongoose, { Document, Schema } from "mongoose";

export interface IAdminRevenue extends Document {
  admin: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  userCount: number; // No. of users who paid 1500
  totalRegistrationFees: number; // userCount * 1500
  adRevenues: {
    user: { _id: mongoose.Types.ObjectId; name: string };
    budget: number;
    adminShare: number; // 33.33% of budget
  }[];
  totalAdRevenue: number; // Sum of all admin  shares
  finalRevenue: number; // totalRegistrationFees + totalAdRevenue
}

const AdminRevenueSchema = new Schema<IAdminRevenue>(
  {
    admin: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      role: { type: String, enum: ["admin"], required: true },
    },
    userCount: { type: Number, default: 0 },
    totalRegistrationFees: { type: Number, default: 0 },
    adRevenues: [
      {
        user: {
          _id: { type: Schema.Types.ObjectId, ref: "User" },
          name: { type: String },
        },
        budget: { type: Number },
        adminShare: { type: Number },
      },
    ],
    totalAdRevenue: { type: Number, default: 0 },
    finalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AdminRevenue =
  mongoose.models.AdminRevenue ||
  mongoose.model<IAdminRevenue>("AdminRevenue", AdminRevenueSchema);

export default AdminRevenue;
