import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();

// ✅ CORS config (allow frontend)
app.use(cors({
  origin: "https://frontend-svfw.onrender.com",
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ DB and Server
const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
