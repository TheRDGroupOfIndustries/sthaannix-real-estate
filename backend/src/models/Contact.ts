import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdBy?: mongoose.Types.ObjectId; // Reference to User
  createdAt: Date;
}

const ContactSchema: Schema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" }, // optional reference
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
