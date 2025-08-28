import express from "express";
import {
  getAllContacts,
  getUserReplies,
  handleContactForm,
  replyToContact,
} from "../controllers/contactUsController";
import { authenticate } from "../middlewares/authenticate";
import { adminOnly } from "../middlewares/adminOnly";

const router = express.Router();

router.post("/send", authenticate, handleContactForm);
router.get("/get-my-replies", authenticate, getUserReplies);

router.get("/contacts", authenticate, adminOnly, getAllContacts);
router.put("/reply/:contactId", authenticate, adminOnly, replyToContact);

export default router;
 