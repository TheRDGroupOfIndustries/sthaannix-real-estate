import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../models/User"; 

export interface IAdCampaign extends Document {
  property: mongoose.Types.ObjectId | Pick<IUser, "_id" | "name" | "email" | "phone">;
  user: mongoose.Types.ObjectId;
  budget: number;
  platform: ("meta ads" | "google ads")[];
  startDate: Date;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "cancelled";
}

const AdCampaignSchema = new Schema<IAdCampaign>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    budget: { type: Number, required: true },
    platform: {
      type: [String],
      enum: ["meta ads", "google ads"],
      required: true,
    },
    startDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAdCampaign>("AdCampaign", AdCampaignSchema);
