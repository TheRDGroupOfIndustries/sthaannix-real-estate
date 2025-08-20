import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/userController";
import  {authenticate} from "../middlewares/authenticate"
const router = express.Router();

// User self-management
router.get("/get", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.delete("/delete", authenticate, deleteProfile);


export default router;
