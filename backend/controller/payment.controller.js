import { body, validationResult } from "express-validator";
import db from "../client/connect.js"; // Prisma client
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

// Validators for submitting payment
export const validateSubmitPayment = [
  body("requestId").notEmpty().withMessage("requestId is required"),
  body("method")
    .isIn(["UPI", "ACCOUNT", "WHATSAPP"])
    .withMessage("Invalid payment method"),
  body("utr").optional().isString().trim(),
];

// Submit Payment Controller
export const submitPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { requestId, method, utr } = req.body;

  try {
    // Find the pending registration request
    const request = await db.registrationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ message: "Registration request not found" });
    }

    // Upload proofs if provided
 let proofUrls = [];
if (Array.isArray(req.files) && req.files.length > 0) {
  proofUrls = await Promise.all(
    req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, file.originalname, "registration_proofs")
    )
  );
}

    // Save or update payment info and mark as APPROVED
    const payment = await db.registrationPayment.upsert({
      where: { requestId },
      update: { method, utr, proofImages: proofUrls, status: "APPROVED" },
      create: { requestId, method, utr, proofImages: proofUrls, status: "APPROVED" },
    });

    // Create the actual user
    const user = await db.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: request.password,
        phone: request.phone,
        role: request.role,
      },
    });

    // Keep registration request for records; do not delete to avoid FK errors

    res.status(201).json({
      message: "Payment successful, user registered",
      payment,
      user,
    });
  } catch (e) {
    if (e && e.code === "P2002") {
      return res.status(409).json({ message: "Duplicate entry detected" });
    }
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
