import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
	const accessToken = jwt.sign(user, process.env.JWT_SECRET);
	return { accessToken };
};

export const verifyTokenFromHeader = (authHeader) => {
	if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
	const token = authHeader.split(" ")[1];
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		return null;
	}
}; 