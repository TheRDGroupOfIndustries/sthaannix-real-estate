import db from "../client/connect.js";

// Admin: list pending registrations (optional filters)
export const listPending = async (_req, res) => {
	try {
		const rows = await db.registrationPayment.findMany({
			where: { status: "PENDING" },
			include: { request: true },
		});
		res.json(rows);
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Server error" });
	}
};

// Admin: approve a registration → create real User + ListingFee, mark payment APPROVED
export const approveRegistration = async (req, res) => {
	const { id } = req.params; // payment id
	try {
		const payment = await db.registrationPayment.findUnique({
			where: { id },
			include: { request: true },
		});

		if (!payment) {
			res.status(404).json({ message: "Payment not found" });
			return;
		}

		if (payment.status !== "PENDING") {
			res.status(400).json({ message: "Already reviewed" });
			return;
		}

		// Create real user from request
		const user = await db.user.create({
			data: {
				name: payment.request.name,
				email: payment.request.email,
				password: payment.request.password, // already hashed
				phone: payment.request.phone,
				role: payment.request.role,
			},
		});

		// Create ListingFee record for transparency (₹1500 default)
		await db.listingFee.create({
			data: { userId: user.id, amount: payment.amount, duration: 30 },
		});

		const updated = await db.registrationPayment.update({
			where: { id },
			data: {
				status: "APPROVED",
				verifiedBy: req.user && req.user.id,
				verifiedAt: new Date(),
			},
		});

		res.json({ message: "Approved", user, payment: updated });
	} catch (e) {
		if (e && e.code === "P2002") {
			res.status(409).json({ message: "Email already exists as user" });
			return;
		}
		console.error(e);
		res.status(500).json({ message: "Server error" });
	}
};

// Admin: reject a registration (keeps request for audit)
export const rejectRegistration = async (req, res) => {
	const { id } = req.params; // payment id
	try {
		const payment = await db.registrationPayment.update({
			where: { id },
			data: {
				status: "REJECTED",
				verifiedBy: req.user && req.user.id,
				verifiedAt: new Date(),
			},
		});
		res.json({ message: "Rejected", payment });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Server error" });
	}
}; 