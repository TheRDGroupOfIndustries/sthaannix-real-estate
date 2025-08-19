import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnect from "./config/db";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import adminRoutes from "./routes/adminRoutes"
import leadRoutes from "./routes/leadRoutes";
import walletRoutes from "./routes/walletRoutes";
import adminStatsRoutes from "./routes/adminStatusRoutes"

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/user", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/admin", adminRoutes);
app.use("/leads", leadRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminStatsRoutes);


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
