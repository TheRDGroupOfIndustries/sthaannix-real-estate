import mongoose, { Schema, Document } from "mongoose";

const LeadStatus = ["open", "closed"] as const;
export type LeadStatus = typeof LeadStatus[number];

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
    status: { type: String, enum: LeadStatus, default: "open", index: true },
  },
  { timestamps: true }
);

LeadSchema.index(
  { property: 1, buyer: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "open" } }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
