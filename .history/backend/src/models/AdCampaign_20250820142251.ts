import mongoose, { Document, Schema } from "mongoose";

export interface IAdCampaign extends Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  budget: number;
  platform: ("meta ads"  | "google")[];
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "cancelled" |"pending",
}

const AdCampaignSchema = new Schema<IAdCampaign>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    budget: { type: Number, required: true },
    platform: {
      type: [String],
      enum: ["facebook", "instagram", "google"],
      required: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  },
  { timestamps: true }
);

export default mongoose.model<IAdCampaign>("AdCampaign", AdCampaignSchema);
