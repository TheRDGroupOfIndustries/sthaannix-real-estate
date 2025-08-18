import jwt from "jsonwebtoken";
import prisma from "../client/connect.js";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1h";

export const auth = async (req, res, next) => {
	try {
		const header = req.headers.authorization || "";
		const token = header.startsWith("Bearer ") ? header.slice(7) : null;

		if (!token) {
			return res.status(401).json({ message: "Missing token" });
		}

		const payload = jwt.verify(token, JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: payload.sub },
		});

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (e) {
		return res.status(401).json({ message: "Invalid/expired token" });
	}
};

export const signToken = (user) => {
	const options = {
		expiresIn: TOKEN_EXPIRES_IN,
		algorithm: "HS256",
	};

	return jwt.sign(
		{ sub: user.id, role: user.role, email: user.email },
		JWT_SECRET,
		options
	);
}; 