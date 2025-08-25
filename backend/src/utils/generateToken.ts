import jwt, { SignOptions } from "jsonwebtoken";

interface UserPayload {
  id: string;
  role: string;
  email: string;
  name: string;
  status: string;
}

export const generateToken = (payload: UserPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "2h") as SignOptions["expiresIn"],

  };

  return jwt.sign(payload, secret, options); 
};
