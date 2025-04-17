import express from "express";
import {
  adminLogin,
  getAllUser,
  login,
  signup,
} from "../controller/UserController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", signup);
router.post("/auth/login", login);
router.post("/auth/adminLogin", adminLogin);

// admin routes
router.get("/all-users", isAuthenticated, isAdmin, getAllUser);

export default router;
