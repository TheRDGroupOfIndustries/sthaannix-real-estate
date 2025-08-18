export const requireRole =
	(...roles) =>
	(req, res, next) => {
		if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	}; 