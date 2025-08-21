import { Request, Response } from "express";
import mongoose from "mongoose";
import Property from "../models/Property";
import Lead from "../models/Lead";
import { sendLeadNotification, sendLeadStatusUpdate } from "../utils/emailService";
import User from "../models/User";

const buyerOnly = (role?: string) => role === "buyer";
const sellerRoles = ["owner", "broker", "builder"];

export const createLead = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!buyerOnly(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only buyers can send enquiries" });
    }

    const { propertyId, message } = req.body as {
      propertyId: string;
      message?: string;
    };

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Valid propertyId is required" });
    }

    // Check duplicate lead
    const existingLead = await Lead.findOne({
      property: propertyId,
      buyer: req.user.id,
    });

    if (existingLead) {
      return res
        .status(400)
        .json({ message: "You already enquired about this property" });
    }

    // Fetch property + owner
    const property = await Property.findById(propertyId).populate(
      "owner",
      "email"
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot enquire on your own property" });
    }

    const lead = await Lead.create({
      property: property._id,
      buyer: req.user.id,
      owner: property.owner,
      message,
    });

    const username = await User.findById(req.user.id);

    if (property.owner && (property.owner as any).email) {
      await sendLeadNotification((property.owner as any).email, {
        propertyTitle: property.title,
        buyerName: username?.name,
        buyerEmail: username?.email,

        price: property.price,
        message,
      });
    }

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create lead", error: err });
  }
};

export const getMyLeadsAsBuyer = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!buyerOnly(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only buyers can view their enquiries" });
    }

    const leads = await Lead.find({ buyer: req.user.id })
      .populate("property", "title price location.city")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leads", error: err });
  }
};

export const getLeadsForMyProperties = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!sellerRoles.includes(req.user.role) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
 
    const query = req.user.role === "admin" ? {} : { owner: req.user.id };

    const leads = await Lead.find(query)
      .populate("property", "title price location.city")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leads", error: err });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    if (
      !req.user ||
      (!sellerRoles.includes(req.user.role) && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { id } = req.params;
    const { status, responseMessage } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("property buyer"); 

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const property = updatedLead.property as any;
    const buyer = updatedLead.buyer as any;

    if (buyer?.email) {
      await sendLeadStatusUpdate(buyer.email, {
        propertyTitle: property?.title || "Property",
        status: updatedLead.status,
        responseMessage,
      });
    }

    res.json({
      message: "Lead status updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update lead",
      error: (error as Error).message,
    });
  }
};
