import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./config/db";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import adminRoutes from "./routes/adminRoutes";
import leadRoutes from "./routes/leadRoutes";
import walletRoutes from "./routes/walletRoutes";
import adminStatsRoutes from "./routes/adminStatusRoutes";
import userRoutes from "./routes/userRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import adRoute from "./routes/adRoutes";
import revenueRoute from "./routes/adminRevenueRoute";
import contactRoutes from "./routes/contactRoutes";

const app = express();
const port = process.env.PORT || 12000;
app.use(
  cors({ 
    origin: ["http://localhost:5173", "http://localhost:5174", "https://sthaannix-real-estate.vercel.app", "https://sthaannix-real-estate-xyrj.vercel.app"],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/admin", adminRoutes);
app.use("/leads", leadRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminStatsRoutes);
app.use("/me", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/ad", adRoute);
app.use("/revenue", revenueRoute);
app.use("/contact", contactRoutes);

const runServer = async () => {
  const connected = await dbConnect();
  if (connected) {
    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } else {
    console.log("Unable to run the server");
  }
};

runServer();
