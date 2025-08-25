import { Request, Response } from "express";
import User from "../models/User";
import Property from "../models/Property";
import Lead from "../models/Lead";
import TopUpRequest from "../models/TopUpRequest";

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      usersByRole,
      totalProperties,
      propertiesByStatus,
      totalLeads,
      leadsOpen,
      leadsClosed,
      totalCredits,
      totalDebits,
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Property.countDocuments(),
      Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.countDocuments(),
      Lead.countDocuments({ status: "open" }),
      Lead.countDocuments({ status: "closed" }),
      TopUpRequest.aggregate([
        { $match: { type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      TopUpRequest.aggregate([
        { $match: { type: "debit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      users: {
        total: totalUsers,
        byRole: usersByRole.reduce(
          (acc: any, r) => ({ ...acc, [r._id]: r.count }),
          {}
        ),
      },
      properties: {
        total: totalProperties,
        byStatus: propertiesByStatus.reduce(
          (acc: any, r) => ({ ...acc, [r._id]: r.count }),
          {}
        ),
      },
      leads: { total: totalLeads, open: leadsOpen, closed: leadsClosed },
      wallet: {
        totalCredits: totalCredits[0]?.total || 0,
        totalDebits: totalDebits[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get stats", error: err });
  }
};


export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await User.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "owner",
          as: "properties",
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "owner",
          as: "leads",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          totalProperties: { $size: "$properties" },
          totalLeads: { $size: "$leads" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
