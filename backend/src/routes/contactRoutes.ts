import express from "express";
import {
  getAllContacts,
  handleContactForm,
} from "../controllers/contactUsController";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";

const router = express.Router();

router.post("/send", authenticate, handleContactForm);
router.get("/contacts", authenticate, adminOnly, getAllContacts);

export default router;
 