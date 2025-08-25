import { Request, Response } from "express";
import Payment from "../models/Payment";
import User from "../models/User";
import { uploadFile } from "../utils/uploadToCloudinary";
import TopUpRequest from "../models/TopUpRequest";
import mongoose from "mongoose";

// export const uploadPaymentProof = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { amount, purpose, utrNumber, proof } = req.body; // proof can be URL
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (purpose === "registration" && amount < 1500) {
//       return res
//         .status(400)
//         .json({ message: "Registration fee must be ₹1500 or higher" });
//     }

//     let screenshot = "";

//     // Case 1: File uploaded
//     if (req.file) {
//       const uploaded = await uploadFile(req.file.buffer, "payments/proofs");
//       screenshot = uploaded.secure_url;
//     }
//     // Case 2: Proof URL provided in JSON
//     else if (proof) {
//       screenshot = proof;
//     } else {
//       return res.status(400).json({ message: "Proof image required (file or URL)" });
//     }

//     const payment = await Payment.create({
//       user: user._id,
//       amount,
//       purpose,
//       utrNumber,
//       screenshot,
//       status: "pending",
//     });

//     res.status(201).json({ message: "Payment proof submitted for approval", payment });
//   } catch (error) {
//     res.status(500).json({ message: "Payment submission failed", error });
//   }
// };

// export const approvePayment = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     if (!req.user || req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access required" });
//     }

//     const { id } = req.params;
//     const payment = await Payment.findById(id).session(session);

//     if (!payment) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (payment.status !== "pending") {
//       await session.abortTransaction();
//       return res.status(400).json({ message: "Payment already processed" });
//     }

//     const user = await User.findById(payment.user).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "User not found" });
//     }

//     payment.status = "approved";
//     payment.approvedBy = new mongoose.Types.ObjectId(req.user.id);
//     payment.reviewedAt = new Date(); //  track review date
//     await payment.save({ session });

//     if (payment.purpose === "registration") {
//       user.role = "broker";
//       await user.save({ session });
//     }

//     if (payment.purpose === "promotion") {
//       user.walletBalance += payment.amount;
//       await user.save({ session });

//       await TopUpRequest.create(
//         [ 
//           {
//             user: user._id,
//             amount: payment.amount,
//             type: "credit",
//             note: "Manual top-up approval",
//             balanceAfter: user.walletBalance,
//           },
//         ],
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     res.json({ message: "Payment approved", payment });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: "Approval failed", error });
//   } finally {
//     session.endSession();
//   }
// };


export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { amount, purpose, utrNumber, proof, requestedRole, paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate payment method
    if (!["upi", "account", "whatsapp"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Validate amounts
    if (purpose === "registration" && amount < 1500) {
      return res
        .status(400)
        .json({ message: "Registration fee must be ₹1500 or higher" });
    }

    // Validate requested role if role-upgrade
    if (purpose === "role-upgrade") {
      if (!requestedRole || !["broker", "builder", "owner"].includes(requestedRole)) {
        return res
          .status(400)
          .json({ message: "Valid requestedRole (broker, builder, owner) is required for role-upgrade" });
      }
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

    const payment = await Payment.create({
      user: user._id,
      amount,
      purpose,
      utrNumber,
      screenshot: screenshots.length === 1 ? screenshots[0] : screenshots,
      status: "pending",
      paymentMethod, // ✅ save payment method
      meta: purpose === "role-upgrade" ? { requestedRole } : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Payment proof submitted for approval",
      payment,
    });

  } catch (error: any) {
    console.error("Upload Payment Proof Error:", error);

    if (error.code === 11000 && error.keyPattern?.utrNumber) {
      return res.status(400).json({
        success: false,
        message: "This UTR number has already been used. Please provide a unique transaction reference.",
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Payment submission failed. Please try again later.",
      error: error.message,
    });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  console.log("id :",req.params.id);
  console.log("user :",req.user);
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

    // Approve payment
    payment.status = "approved";
    payment.approvedBy = new mongoose.Types.ObjectId(req.user.id);
    payment.reviewedAt = new Date();
    await payment.save({ session });

    // Handle purposes
    if (payment.purpose === "registration") {
      if (req.body.role) {
        user.role = req.body.role;
        await user.save({ session });
      }
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

    if (payment.purpose === "role-upgrade") {
      const requestedRole = payment.meta?.requestedRole;
      if (requestedRole && ["broker", "builder", "owner"].includes(requestedRole)) {
        user.role = requestedRole;
        user.status = "approved"; //  or "pending" if you want extra verification
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    res.json({
      message: "Payment approved successfully",
      payment,
      user: {
        id: user._id,
        role: user.role,
        status: user.status,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    // await session.abortTransaction();
    // res.status(500).json({ message: "Approval failed", error });
     console.error("Approval error:", error); // Add this for backend visibility
  await session.abortTransaction();
  res.status(500).json({ message: "Approval failed", error: error });
  } finally {
    session.endSession();
  }
};


// export const getAllPayments = async (req: Request, res: Response) => {
//   try {
//     if (!req.user || req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access required" });
//     }

//     const { status } = req.query;
//     const filter: any = {};
//     if (status) filter.status = status;

//     const payments = await Payment.find(filter)
//       .populate("user", "name email role")
//       .sort({ createdAt: -1 });

//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch payments", error });
//   }
// };

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    //  Normal Payments (registration, promotion, role upgrade)
    const payments = await Payment.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    //  Wallet Top-up Payments
    const topUps = await TopUpRequest.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    //  Normalize both collections into a single array
    const combined = [
      ...payments.map((p) => ({
        _id: p._id,
        type: "Registration",
        user: p.user,
        amount: p.amount,
        purpose: p.purpose,
        status: p.status,
        paymentMethod: p.paymentMethod,
        utrNumber: p.utrNumber,
        screenshot: p.screenshot,
        reviewedAt: p.reviewedAt,
        approvedBy: p.approvedBy,
        createdAt: p.createdAt,
      })),
      ...topUps.map((t) => ({
        _id: t._id,
        type: "Wallet",
        user: t.user,
        utrNumber: t.utrNumber,
        amount: t.amount,
        status: t.status,
        proofUrl: t.proofUrl,
        reviewedAt: t.reviewedAt,
        reviewedBy: t.reviewedBy,
        createdAt: t.createdAt,
      })),
    ];

    // 🔹 Sort merged results by newest first
    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      message: "Payments & Wallet Top-ups fetched successfully",
      data: combined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error instanceof Error ? error.message : error,
    });
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

    // Get normal payments
    const payments = await Payment.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Get wallet top-ups
    const topUps = await TopUpRequest.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Combine both with a tag to distinguish them
    const allTransactions = [
      ...payments.map((p) => ({
        ...p.toObject(),
        type: "payment", // tag it
      })),
      ...topUps.map((t) => ({
        ...t.toObject(),
        type: "wallet-topup", // tag it
      })),
    ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    res.json({
      success: true,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("getMyPayments error:", error);
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};


