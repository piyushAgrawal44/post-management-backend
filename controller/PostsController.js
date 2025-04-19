import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { Comments } from "../model/Comments.js";
import { Posts } from "../model/Posts.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/utils.js";

export const createPost = TryCatchHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req?.user?._id;

  if (!title || !content)
    return next(new ErrorHandler("Title and Content is required", 400));

  await Posts.create({ userId, title, content });

  return sendResponse(res, 201, "Post Submitted Successfully");
});

export const getAllPosts = TryCatchHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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
