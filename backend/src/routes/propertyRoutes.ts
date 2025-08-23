import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";

import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer"; // your multer setup
import { checkUserApproval } from "../middlewares/checkUserApproval";

const router = Router();

// Public routes
router.get("/get", getProperties);
router.get("/get-by-id/:id", getPropertyById);

// Protected routes
router.post(
  "/create",
  authenticate,
  checkUserApproval,
  upload.array("images", 10),
  createProperty
);
router.put(
  "/update/:id",
  authenticate,
  checkUserApproval,
  upload.array("images", 10),
  updateProperty
);
router.delete("/delete/:id", authenticate, checkUserApproval, deleteProperty);

export default router;
