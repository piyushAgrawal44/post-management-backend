import express from "express";
import {
  adminLogin,
  getMyProfile,
  login,
  signup,
} from "../controller/UserController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/adminLogin", adminLogin);

// admin routes
router.get("/auth/my-profile", isAuthenticated, getMyProfile);

export default router;
