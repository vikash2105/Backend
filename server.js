import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// ✅ CORS Configuration (Allow Render Frontend)
app.use(cors({
  origin: "https://frontend-svfw.onrender.com", // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running and healthy!");
});

// ✅ Database Connection + Server Startup
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
