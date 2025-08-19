import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  createLead,
  getMyLeadsAsBuyer,
  getLeadsForMyProperties,
  updateLeadStatus,
} from "../controllers/leadController";

const router = Router();

// Buyer
router.post("/create", authenticate, createLead);
router.get("/my", authenticate, getMyLeadsAsBuyer);

// Owner/Broker/Builder (and Admin)
router.get("/my-properties", authenticate, getLeadsForMyProperties);
router.put("/:id/status", authenticate, updateLeadStatus);

export default router;
 