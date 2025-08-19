import mongoose, { Schema, Document } from "mongoose";

export type PropertyType = "plot" | "apartment" | "commercial" | "villa" | "house";
export type TxType = "buy" | "rent" | "lease";
export type PropertyStatus = "pending" | "approved" | "rejected";

export interface IProperty extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  propertyType: PropertyType;
  transactionType: TxType;
  price: number;
  size?: number; // sq.ft
  bhk?: number;
  images: string[];
  videos: string[];
  location: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    coordinates?: { type: "Point"; coordinates: [number, number] }; 
  };
  isPromoted: boolean;
  status: PropertyStatus;
} 

const LocationSchema = new Schema({
  address: String,
  city: String,
  state: String,
  pincode: String,
  coordinates: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
  },
});

const PropertySchema = new Schema<IProperty>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    propertyType: { type: String, enum: ["plot", "apartment", "commercial", "villa", "house"], required: true },
    transactionType: { type: String, enum: ["buy", "rent", "lease"], required: true },
    price: { type: Number, required: true, index: true },
    size: { type: Number },
    bhk: { type: Number },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    location: { type: LocationSchema, default: {} },
    isPromoted: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: true }
);

// text index for keyword search
PropertySchema.index({ title: "text", description: "text", "location.address": "text", "location.city": "text" });
// fast sort by newest
PropertySchema.index({ createdAt: -1 });

export default mongoose.model<IProperty>("Property", PropertySchema);
