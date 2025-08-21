import { Router } from "express";
import { getPendingUsers, approveUser, rejectUser, approveProperty, rejectProperty, deleteProperty, getAllProperties } from "../controllers/adminController";
import { adminOnly } from "../middlewares/adminOnly"; 
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// user routes
router.get("/pending-users",authenticate, adminOnly, getPendingUsers);
router.patch("/approve-user/:id",authenticate, adminOnly, approveUser);
router.patch("/reject-user/:id", authenticate, adminOnly, rejectUser);

// property routes
router.get("/properties", authenticate, adminOnly, getAllProperties);
router.patch("/approve-property/:id", authenticate, adminOnly, approveProperty);
router.patch("/reject-property/:id", authenticate, adminOnly, rejectProperty);
router.delete("/property/:id", authenticate, adminOnly, deleteProperty);

export default router;
