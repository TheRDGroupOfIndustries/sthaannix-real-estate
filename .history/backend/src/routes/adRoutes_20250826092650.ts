import { Router } from "express";
import { getAllAdRequests, submitAdRequest, updateAdStatus } from "../controllers/adController";

const router = Router();

// User submits ad request (default status = pending)
router.post("/create", submitAdRequest);

// Admin updates status (approved/rejected/pending)
router.put("/:id/status", updateAdStatus);

// admin get all add request
router.get("/get",getAllAdRequests);

//only user ad
router.get("/my-ads",);

export default router;
