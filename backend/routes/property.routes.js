import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controller/property.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// POST and PUT with max 4 images
router.post("/create", upload.array("images", 4), createProperty);
router.put("/update/:id", upload.array("images", 4), updateProperty);

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.delete("/delete/:id", deleteProperty);

export default router;
