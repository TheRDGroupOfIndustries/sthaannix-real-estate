import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Transaction from "../models/Transaction";
import TopUpRequest from "../models/TopUpRequest";
import { uploadFile } from "../utils/uploadToCloudinary";

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("walletBalance");

    if (!user) return res.status(404).json({ message: "User not found" });

    const txns = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ walletBalance: user.walletBalance, transactions: txns });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallet", error: err });
  }
};

export const createTopUpRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { amount } = req.body as { amount: string };
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Proof image is required (field name: proof)" });
    }

    const uploaded = await uploadFile(req.file.buffer, "payments/proofs");
    const topUp = await TopUpRequest.create({
      user: req.user.id,
      amount: numericAmount,
      proofUrl: uploaded.secure_url,
    });

    res.status(201).json({ message: "Top-up request submitted", topUp });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit top-up request", error: err });
  }
};

// ADMIN list pending topups
export const listTopUpRequests = async (req: Request, res: Response) => {
  try {
    const { status } = req.query as { status?: string };
    const query: any = {};
    if (status) query.status = status;
    const requests = await TopUpRequest.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch top-up requests", error: err });
  }
};

// ADMIN approve / reject
export const reviewTopUpRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { action, reason } = req.body as {
      action: "approve" | "reject";
      reason?: string;
    };

    const topUp = await TopUpRequest.findById(id).session(session);
    if (!topUp) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Top-up request not found" });
    }
    if (topUp.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Request already reviewed" });
    }

    if (action === "reject") {
      topUp.status = "rejected";
      topUp.reviewedBy = new mongoose.Types.ObjectId(req.user.id);
      topUp.reviewedAt = new Date();
      topUp.reason = reason || "Not specified";
      await topUp.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: "Top-up rejected", topUp });
    }

    const user = await User.findById(topUp.user).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    user.walletBalance += topUp.amount;
    await user.save({ session });

    const txn = await Transaction.create(
      [
        {
          user: user._id,
          amount: topUp.amount,
          type: "credit",
          method: "manual",
          note: "Wallet top-up approved",
          balanceAfter: user.walletBalance,
        },
      ],
      { session }
    );

    topUp.status = "approved";
    topUp.reviewedBy = new mongoose.Types.ObjectId(req.user.id);
    topUp.reviewedAt = new Date();
    await topUp.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Top-up approved", topUp, transaction: txn[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Failed to review top-up", error: err });
  }
};
