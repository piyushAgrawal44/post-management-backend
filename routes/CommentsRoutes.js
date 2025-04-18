import express from "express";
import {
    addComment,
    approveComment,
    getAllCommentsOfPosts,
} from "../controller/CommentsController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posts/:postId/add-comment", isAuthenticated, addComment);

router.get(
  "/posts/:postId/all-comments",
  isAuthenticated,
  getAllCommentsOfPosts
);

router.put(
  "/posts/:postId/approve-comment",
  isAuthenticated,
  isAdmin,
  approveComment
);

export default router;
