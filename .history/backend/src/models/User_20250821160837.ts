import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "buyer" | "broker" | "builder" | "owner" | "admin" ;

export type UserStatus = "pending" | "approved" | "rejected";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  isVerified: boolean;
  walletBalance: number;
  status: UserStatus; 
} 

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ["buyer", "broker", "builder", "owner", "admin"], required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, 
  },
  { timestamps: true }
);
export default mongoose.model<IUser>("User", UserSchema);
