import { Request, Response } from "express";
import User from "../models/User";
import Payment from "../models/Payment";
import AdCampaign from "../models/AdCampaign";
import AdminRevenue from "../models/adminRevenue";

// Get Admin Revenue Details
export const getAdminRevenue = async (req: Request, res: Response) => {
  try {
    // 1. Fetch admin user
    const admin = await User.findOne({ role: "admin" }).lean();
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // 2. Count users who paid ₹1500 for registration
    const paidUsers = await Payment.find({
      purpose: "registration",
      amount: 1500,
      status: "approved",
    }).populate("user", "name email phone");

    const userCount = paidUsers.length;
    const totalRegistrationFees = userCount * 1500;

    // 3. Calculate ad campaign revenues (33.33% share for admin)
      const campaigns = await AdCampaign.find({
    status: { $in: ["approved", "active"] } 
  }).populate("user", "name");

      const adRevenues = campaigns.map((campaign) => {
      const user = campaign.user as any; 
      const adminShare = Number((campaign.budget * 0.3333).toFixed(2));

      return {
        user: {
          _id: user._id,
          name: user.name,
        },
        budget: campaign.budget,
        adminShare,
      };
    });


    const totalAdRevenue = adRevenues.reduce((sum, ad) => sum + ad.adminShare, 0);

    // 4. Final revenue
    const finalRevenue = totalRegistrationFees + totalAdRevenue;

    // 5. Save/Update AdminRevenue document
    const adminRevenue = await AdminRevenue.findOneAndUpdate(
      { "admin._id": admin._id },
      {
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
        },
        userCount,
        totalRegistrationFees,
        adRevenues,
        totalAdRevenue,
        finalRevenue,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin revenue fetched successfully",
      data: adminRevenue,
    });
  } catch (error: any) {
    console.error("Error fetching admin revenue:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
