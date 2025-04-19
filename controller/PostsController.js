// controllers/post.controller.js
import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { Comments } from "../model/Comments.js";
import { Posts } from "../model/Posts.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/utils.js";
import { getAllPostsSchema, createPostSchema } from "../validators/post.validator.js";

// CREATE POST
export const createPost = TryCatchHandler(async (req, res, next) => {
  const { error, value } = createPostSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const userId = req?.user?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized: User not found", 401));
  }

  await Posts.create({ userId, ...value });

  return sendResponse(res, 201, "Post Submitted Successfully");
});

// GET ALL POSTS
export const getAllPosts = TryCatchHandler(async (req, res, next) => {
  const { error, value } = getAllPostsSchema.validate(req.query);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { page, limit } = value;
  const skip = (page - 1) * limit;

  const allPosts = await Posts.find({})
    .populate("userId", "emailOrUserName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const filterOpt = (post) =>
    req?.user?.role === "admin"
      ? { postId: post?._id?.toString() }
      : { postId: post?._id?.toString(), status: "Approved" };

  const transformedPosts = await Promise.all(
    allPosts.map(async (post) => ({
      ...post,
      comments: await Comments.countDocuments(filterOpt(post)),
    }))
  );

  return sendResponse(res, 200, "", transformedPosts);
});
