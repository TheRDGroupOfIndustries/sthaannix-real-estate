import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import TopUpRequest from "../models/TopUpRequest";
import { uploadFile } from "../utils/uploadToCloudinary";


export const getMyWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("walletBalance");
    if (!user) return res.status(404).json({ message: "User not found" });

    const txns = await TopUpRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      message: "Wallet fetched successfully",
      data: { walletBalance: user.walletBalance, transactions: txns },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch wallet",
      error: err instanceof Error ? err.message : err,
    });
  }
};

export const createTopUpRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const existingPending = await TopUpRequest.findOne({
      user: req.user.id,
      status: "pending",
    });
    if (existingPending) {
      return res.status(400).json({
        message:
          "You already have a pending top-up request. Please wait for review.",
      });
    }

    const { amount, utrNumber,pro paymentMethod } = req.body as { 
      amount: string; 
      utrNumber?: string;
      paymentMethod?: "upi" | "account" | "whatsapp"; 
    };

    const numericAmount = Number(amount);

    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    if (numericAmount < 100) {
      return res.status(400).json({ message: "Minimum top-up amount is ₹100" });
    }

     let screenshots: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        console.log("Multer parsed file:", file.originalname);
        const uploaded = await uploadFile(file.buffer, "payments/proofs");
        screenshots.push(uploaded.secure_url);
      }
    } else if (proof) {
      screenshots.push(proof);
    } else {
      return res.status(400).json({ message: "Proof image required (file or URL)" });
    }

      const topUp = await TopUpRequest.create({
        user: req.user.id,
        amount: numericAmount,
        proofUrls: uploadedProofs,   // ✅ array of urls
        status: "pending",
        utrNumber: utrNumber || undefined,
        paymentMethod: paymentMethod || "upi",
      });

    res.status(201).json({
      message: "Top-up request submitted successfully",
      data: topUp,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to submit top-up request",
      error: err instanceof Error ? err.message : err,
    });
  }
};


export const listTopUpRequests = async (req: Request, res: Response) => {
  try {
    const { status, utrNumber } = req.query as { status?: string; utrNumber?: string };
    const query: any = {};
    if (status) query.status = status;
    if (utrNumber) query.utrNumber = utrNumber; //  Allow filtering by UTR number

    const requests = await TopUpRequest.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Top-up requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch top-up requests",
      error: err instanceof Error ? err.message : err,
    });
  }
};

export const reviewTopUpRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { action, reason, utrNumber, paymentMethod } = req.body as {
      action: "approve" | "reject";
      reason?: string;
      utrNumber?: string;
      paymentMethod?: "upi" | "account" | "whatsapp";
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid TopUp ID" });
    }

    const topUp = await TopUpRequest.findById(id).session(session);
    if (!topUp) {
      return res.status(404).json({ message: "Top-up request not found" });
    }

    const user = await User.findById(topUp.user).session(session);
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }

    if (topUp.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (utrNumber) {
      topUp.utrNumber = utrNumber; // Admin can update/add UTR No during review
    }

    if (paymentMethod) {
      topUp.paymentMethod = paymentMethod; // ✅ now safe
    }

    if (action === "approve") {
      topUp.status = "approved";
      user.walletBalance += topUp.amount;
      await user.save({ session });
    } else if (action === "reject") {
      topUp.status = "rejected";
      topUp.reason = reason;
    }

    await topUp.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: `Top-up ${action}ed successfully`,
      topUp,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};



































// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import User from "../models/User";
// import TopUpRequest from "../models/TopUpRequest";
// import { uploadFile } from "../utils/uploadToCloudinary";

// export const getMyWallet = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const user = await User.findById(req.user.id).select("walletBalance");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const txns = await TopUpRequest.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json({
//       message: "Wallet fetched successfully",
//       data: { walletBalance: user.walletBalance, transactions: txns },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch wallet",
//       error: err instanceof Error ? err.message : err,
//     });
//   }
// };

// export const createTopUpRequest = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const existingPending = await TopUpRequest.findOne({
//       user: req.user.id,
//       status: "pending",
//     });
//     if (existingPending) {
//       return res.status(400).json({
//         message:
//           "You already have a pending top-up request. Please wait for review.",
//       });
//     }

//     const { amount } = req.body as { amount: string };
//     const numericAmount = Number(amount);

//     if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
//       return res.status(400).json({ message: "Valid amount is required" });
//     }

//     if (numericAmount < 100) {
//       return res.status(400).json({ message: "Minimum top-up amount is ₹100" });
//     }

//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ message: "Proof image is required (field name: proof)" });
//     }

//     const uploaded = await uploadFile(req.file.buffer, "payments/proofs");
//     if (!uploaded?.secure_url) {
//       return res.status(500).json({ message: "Failed to upload proof image" });
//     }

//     const topUp = await TopUpRequest.create({
//       user: req.user.id,
//       amount: numericAmount,
//       proofUrl: uploaded.secure_url,
//       status: "pending",
//     });

//     res.status(201).json({
//       message: "Top-up request submitted successfully",
//       data: topUp,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to submit top-up request",
//       error: err instanceof Error ? err.message : err,
//     });
//   }
// };

// export const listTopUpRequests = async (req: Request, res: Response) => {
//   try {
//     const { status } = req.query as { status?: string };
//     const query: any = {};
//     if (status) query.status = status;

//     const requests = await TopUpRequest.find(query)
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       message: "Top-up requests fetched successfully",
//       data: requests,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch top-up requests",
//       error: err instanceof Error ? err.message : err,
//     });
//   }
// };

// export const reviewTopUpRequest = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { id } = req.params;
//     const { action, reason } = req.body as {
//       action: "approve" | "reject";
//       reason?: string;
//     };

//     const topupReq = await TopUpRequest.findById(id);
//     const user = await User.findById(topupReq.user);
//     const amount = topupReq.amount;
//     console.log();

//     if (!user) {
//       return res.status(400).json({ message: "No user found" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid TopUp ID" });
//     }

//     const objectId = new mongoose.Types.ObjectId(id);

//     const topUp = await TopUpRequest.findById(objectId).session(session);

//     if (!topUp) {
//       return res.status(404).json({ message: "Top-up request not found" });
//     }

//     if (topUp.status !== "pending") {
//       return res.status(400).json({ message: "Request already processed" });
//     }

//     if (action === "approve") {
//       topUp.status = "approved";
//       user.walletBalance += amount;
//       user.save();
//     } else if (action === "reject") {
//       topUp.status = "rejected";
//       topUp.reason = reason;
//     }

//     await topUp.save({ session });
//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       message: `Top-up ${action}ed successfully`,
//       topUp,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: (error as Error).message });
//   }
// };
