import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://team-task-manager-eight-chi.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}  origin=${req.headers.origin}`);
  next();
});

const port = process.env.PORT || 4000;
// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log("App is running on port : ", port);
});
