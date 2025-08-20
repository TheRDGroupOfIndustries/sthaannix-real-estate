import { Router } from "express";
import { submitAdRequest, updateAdStatus } from "../controllers/adController";

const router = Router();

// User submits ad request (default status = pending)
router.post("/create", submitAdRequest);

// Admin updates status (approved/rejected/pending)
router.put("/:id/status", updateAdStatus);

router

export default router;
