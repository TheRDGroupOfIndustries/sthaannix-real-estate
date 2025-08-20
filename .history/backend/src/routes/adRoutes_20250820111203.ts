import { Router } from "express";
import { submitAdRequest, updateAdStatus } from "../controllers/adController";

const router = Router();

// User submits ad request (default status = pending)
router.post("/ad-", submitAdRequest);

// Admin updates status (approved/rejected/pending)
router.put("/ad-campaign/:id/status", updateAdStatus);

export default router;
