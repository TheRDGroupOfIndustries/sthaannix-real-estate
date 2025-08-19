import { Request, Response } from "express";
import User from "../models/User";
import Property from "../models/Property";

// User controllers
export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
 
export const approveUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ message: "User approved", user });
  } catch (err) {
    res.status(500).json({ message: "Error approving user" });
  }
};

export const rejectUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json({ message: "User rejected", user });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting user" });
  }
};

// Property controllers
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    const properties = await Property.find(query).populate(
      "owner",
      "name email"
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

export const approveProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property approved", property });
  } catch (error) {
    res.status(500).json({ message: "Error approving property", error });
  }
};

export const rejectProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reason = req.body?.reason || "Not specified"; // 👈 safe access

    const property = await Property.findByIdAndUpdate(
      id,
      { status: "rejected", rejectionReason: reason },
      { new: true }
    );

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.json({ message: "Property rejected", property });
  } catch (error: any) {
    console.error("❌ Reject Error:", error);
    res
      .status(500)
      .json({ message: "Error rejecting property", error: error.message });
  }
}; 

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property", error });
  }
};
