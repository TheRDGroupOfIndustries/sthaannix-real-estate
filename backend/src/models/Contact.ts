import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdBy?: IUser["_id"];
  reply?: string;
  repliedBy?: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    reply: { type: String },
    repliedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
