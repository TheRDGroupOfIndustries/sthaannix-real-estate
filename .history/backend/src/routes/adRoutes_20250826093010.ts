import { Router } from "express";
import { getAllAdRequests, submitAdRequest,getUserAdRequests, updateAdStatus } from "../controllers/adController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// User submits ad request (default status = pending)
router.post("/create", submitAdRequest);

// Admin updates status (approved/rejected/pending)
router.put("/:id/status", updateAdStatus);

// admin get all add request
router.get("/get",getAllAdRequests);

//only user ad
router.get("/my-ads", authenticate,getUserAdRequests);

router.get("/my-ads", authenticate,getUserAdRequests);

export default router;
