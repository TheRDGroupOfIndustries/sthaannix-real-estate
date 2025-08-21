import { Router } from "express";
import { getAdminRevenue } from "../controllers/adminRevenueController";

const router = Router();

//GET revenue report
router.get("/", getAdminRevenue);

export default router;
