import { Request, Response } from "express";
import Contact from "../models/Contact";

export const handleContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
      createdBy: req.user?.id,
    });
    await newContact.save();

    // await sendContactFormMessage({ name, email, phone, message });

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Error handling contact form:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: (error as Error).message,
    });
  }
};
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find()
      .populate("createdBy", "name email role") // who submitted
      .populate("repliedBy", "name email role") // admin who replied
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, contacts });
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch contacts" });
  }
};

export const replyToContact = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const { reply } = req.body;
    const adminId = req.user?.id;

    if (!reply)
      return res.status(400).json({ message: "Reply message is required" });

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { reply, repliedBy: req.user?.id },
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("repliedBy", "name email role");

    return res.status(200).json({
      admid: adminId,
      success: true,
      message: "Reply sent",
      contact: updatedContact,
    });
  } catch (error: any) {
    console.error("Error replying to contact:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send reply" });
  }
};
