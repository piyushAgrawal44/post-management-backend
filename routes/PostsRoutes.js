import express from "express";
import { createPost, getAllPosts } from "../controller/PostsController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posts/create-post", isAuthenticated, createPost);
router.get("/posts/get-post", isAuthenticated, getAllPosts);

export default router;
