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
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options); 
};
