import { Request, Response } from "express";
import AdCampaign from "../models/AdCampaign";
import Property from "../models/Property";
import User from "../models/User";
import mongoose from "mongoose";

export const submitAdRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, propertyId, budget, platform, startDate } = req.body;

    // Validate budget
    if (budget < 1500) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Minimum advertisement budget is ₹1500",
      });
    }

    // Check user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check wallet balance
    if (user.walletBalance < budget) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance. Please top up your wallet.",
      });
    }

    // Store balance before deduction
    const previousBalance = user.walletBalance;

    // Check property exists
    const property = await Property.findById(propertyId).session(session);
    if (!property) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Deduct budget from wallet
    user.walletBalance -= budget;
    await user.save({ session });

    // Create new campaign with pending status
    const newCampaign = new AdCampaign({
      property: propertyId,
      user: userId,
      budget,
      platform,
      startDate,
      status: "pending",
    });

    await newCampaign.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Ad request submitted successfully & wallet Updated",
      campaign: newCampaign,
      previousBalance,              // balance before deduction
      deductedAmount: budget,       // clarity on deduction
      remainingBalance: user.walletBalance, // after deduction
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error submitting ad request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// // Admin updates campaign status
// export const updateAdStatus = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // Validate status
//     if (!["approved", "rejected", "pending"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Allowed values: approved, rejected, pending",
//       });
//     }
//     // Update campaign
//     const campaign = await AdCampaign.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: "Ad campaign not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Ad campaign status updated to ${status}`,
//       campaign,
//     });
//   } catch (error: any) {
//     console.error("Error updating ad status:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

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

    const campaign = await AdCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Ad campaign not found",
      });
    }

    // If rejected refund wallet
    if (status === "rejected" && campaign.status !== "rejected") {
      const user = await User.findById(campaign.user);
      if (user) {
        user.walletBalance += campaign.budget; // refund the ad budget
        await user.save();
      }
    }

    // If approved wallet already deducted at submission
    campaign.status = status;
    await campaign.save();

    return res.status(200).json({
      success: true,
      message: `Ad campaign status updated to ${status}`,
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


// Admin gets all ad requests
export const getAllAdRequests = async (req: Request, res: Response) => {
  try {
    const campaigns = await AdCampaign.find()
      .populate("property") // get full property details
      .populate("user", "name email phone walletBalance")// fetch property details
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

// Get ads of logged-in user
export const getUserAdRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // from JWT middleware

    const campaigns = await AdCampaign.find({ user: userId })
      .populate("property") // get full property details
      .populate("user", "name email phone walletBalance") // fetch specific user fields
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User's ad requests fetched successfully",
      campaigns,
    });
  } catch (error: any) {
    console.error("Error fetching user ad requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Delete ad request
export const deleteAdRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params; // campaign id
    const userId = (req as any).user.id; // from JWT middleware

    // Find campaign
    const campaign = await AdCampaign.findById(id).session(session);
    if (!campaign) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Ad campaign not found" });
    }

    // Ensure the logged-in user is the owner (or admin can bypass this)
    if (campaign.user.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Not authorized to delete this ad" });
    }

    // Refund wallet if ad is still pending (not yet consumed budget)
    if (campaign.status === "pending") {
      const user = await User.findById(userId).session(session);
      if (user) {
        user.walletBalance += campaign.budget;
        await user.save({ session });
      }
    }

    await campaign.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Ad campaign deleted successfully",
      refunded: campaign.status === "pending" ? campaign.budget : 0,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting ad request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
