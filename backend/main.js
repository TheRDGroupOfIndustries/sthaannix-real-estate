import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoute from "./routes/property.routes.js"

const app = express();
const PORT = 12000;

// Allowed origins for CORS
const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"http://localhost:5174",
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Serve static uploads (multer -> Cloudinary fallback)
app.use(
	"/uploads",
	express.static(path.resolve(process.env.UPLOAD_DIR || "uploads"))
);

// Test route
app.get("/", (_req, res) => {
	res.status(200).json({ message: "API is running " });
});

// Auth routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

app.use("/api/payment", paymentRoutes);

// Admin routes 
app.use("/api/admin", adminRoutes);

app.use("/api/property",propertyRoute);

// CORS error handler
app.use((err, _req, res, next) => {
	if (err && err.message === "Not allowed by CORS") {
		res.status(403).json({ error: "CORS policy blocked this request" });
	} else {
		next(err);
	}
});

// Generic error handler
app.use((err, _req, res, _next) => {
	console.error("Unexpected error:", err);
	res.status(500).json({ message: "Unexpected error" });
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on http://localhost:${PORT}`);
}); 