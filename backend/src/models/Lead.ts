import mongoose, { Schema, Document } from "mongoose";

export type LeadStatus = "open" | "closed";

export interface ILead extends Document {
  property: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;  
  owner: mongoose.Types.ObjectId;   
  message?: string;
  status: LeadStatus;
}

const LeadSchema = new Schema<ILead>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
