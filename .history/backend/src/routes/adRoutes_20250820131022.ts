import { Router } from "express";
import { getAllAdRequests, submitAdRequest, updateAdStatus } from "../controllers/adController";

const router = Router();

// User submits ad request (default status = pending)
router.post("/create", submitAdRequest);

// Admin updates status (approved/rejected/pending)
router.put("/:id/status", updateAdStatus);



router.get("/get",getAllAdRequests);

export default router;
