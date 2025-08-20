import { Request, Response } from "express";
import Payment from "../models/Payment";
import User from "../models/User";
import { uploadFile } from "../utils/uploadToCloudinary";
import TopUpRequest from "../models/TopUpRequest";
import mongoose from "mongoose";

export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!req.file)
      return res.status(400).json({ message: "Proof image required" });

    const { amount, purpose, utrNumber } = req.body; //  get UTR number
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (purpose === "registration" && amount < 1500) {
      return res
        .status(400)
        .json({ message: "Registration fee must be ₹1500 or higher" });
    }

    const uploaded = await uploadFile(req.file.buffer, "payments/proofs");

    const payment = await Payment.create({
      user: user._id,
      amount,
      purpose,
      screenshot: uploaded.secure_url,
      utrNumber, //  store UTR number
      status: "pending",
    });

    res
      .status(201)
      .json({ message: "Payment proof submitted for approval", payment });
  } catch (error) {
    res.status(500).json({ message: "Payment submission failed", error });
  }
};


export const approvePayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const payment = await Payment.findById(id).session(session);

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Payment already processed" });
    }

    const user = await User.findById(payment.user).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    payment.status = "approved";
    payment.approvedBy = new mongoose.Types.ObjectId(req.user.id);
    await payment.save({ session });

    if (payment.purpose === "registration") {
      user.role = "broker";
      await user.save({ session });
    }

    if (payment.purpose === "promotion") {
      user.walletBalance += payment.amount;
      await user.save({ session });

      await TopUpRequest.create(
        [
          {
            user: user._id,
            amount: payment.amount,
            type: "credit",
            note: "Manual top-up approval",
            balanceAfter: user.walletBalance,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    res.json({ message: "Payment approved", payment });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Approval failed", error });
  } finally {
    session.endSession();
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status: "rejected", reason, reviewedAt: new Date() }, 
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment rejected", payment });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed", error });
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const payments = await Payment.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};
