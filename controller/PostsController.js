import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
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
    .populate("comments", "status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const roleToFilter = (comments) => {
    return req?.user?.role === "user"
      ? comments?.filter((c) => c?.status === "Approved")?.length
      : comments?.length;
  };

  const transformedPosts = allPosts.map((post) => ({
    ...post,
    comments: roleToFilter(post?.comments) || 0,
  }));

  return sendResponse(res, 200, "", transformedPosts);
});
