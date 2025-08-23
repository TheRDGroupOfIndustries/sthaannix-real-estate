import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User"; // adjust path

const restrictedRoles = ["broker", "builder", "owner"];

export const checkUserApproval = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (restrictedRoles.includes(user.role) && user.status === "pending") {
    return res.status(403).json({
      message: "Your account is pending approval. You cannot create or update properties yet.",
    });
  }

  next();
};
 