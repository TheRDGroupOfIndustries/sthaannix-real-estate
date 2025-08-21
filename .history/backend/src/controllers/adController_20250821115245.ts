import { Request, Response } from "express";
import AdCampaign from "../models/AdCampaign";
import Property from "../models/Property";
import User from "../models/User";

// User submits ad request → default status = pending
export const submitAdRequest = async (req: Request, res: Response) => {
  try {
    const { userId, propertyId, budget, platform, startDate } = req.body;

    // Validate budget
    if (budget < 1500) {
      return res.status(400).json({
        success: false,
        message: "Minimum advertisement budget is ₹1500",
      });
    }

    // Check user & property exist
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Create new campaign with pending status
    const newCampaign = new AdCampaign({
      property: propertyId,
      user: userId,
      budget,
      platform,
      startDate,
      status: "pending",
    });

    await newCampaign.save();

    return res.status(201).json({
      success: true,
      message: "Ad request submitted to admin for review",
      campaign: newCampaign,
    });
  } catch (error: any) {
    console.error("Error submitting ad request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Admin gets all ad requests
export const getAllAdRequests = async (req: Request, res: Response) => {
  try {
    const campaigns = await AdCampaign.find()
      .populate("user", "name email") // fetch user details
      .populate("property", "title price") // fetch property details
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      message: "All ad requests fetched successfully",
      campaigns,
    });
  } catch (error: any) {
    console.error("Error fetching ad requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Admin updates campaign status
export const updateAdStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: approved, rejected, pending",
      });
    }

    const campaign = await AdCampaign.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Ad campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Ad campaign ${status}`,
      campaign,
    });
  } catch (error: any) {
    console.error("Error updating ad status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
