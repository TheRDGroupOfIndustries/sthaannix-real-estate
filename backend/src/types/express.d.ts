import { UserRole } from "../models/User"; // adjust the path

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: UserRole;
      isVerified?: boolean;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
