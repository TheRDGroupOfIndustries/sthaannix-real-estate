import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";
import { getAdminStats } from "../controllers/adminStatsController";

const router = Router();
router.get("/stats", authenticate, adminOnly, getAdminStats);


export default router;
