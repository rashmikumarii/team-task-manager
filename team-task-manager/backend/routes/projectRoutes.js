import express from "express";
import {
  createProject,
  getProjects,
  addMember,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", protect, authorize("Admin"), createProject);

// All logged users
router.get("/", protect, getProjects);

// Add member (Admin)
router.post("/:id/add-member", protect, authorize("Admin"), addMember);

export default router;
