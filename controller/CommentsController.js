import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { Comments } from "../model/Comments.js";

import { ErrorHandler } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/utils.js";

export const addComment = TryCatchHandler(async (req, res, next) => {
  const { comment } = req.body;
  const userId = req?.user?._id;
  const postId = req.params.postId;

  if (!comment) return next(new ErrorHandler("Comment is required", 400));

  await Comments.create({ userId, postId, comment });

  return sendResponse(res, 201, "Comment Added ");
});
export const approveComment = TryCatchHandler(async (req, res, next) => {
  const { status } = req.body;
  const id = req.params.postId;
  if (!id) return next(new ErrorHandler("Comment Id is required", 400));
  if (!status) return next(new ErrorHandler("Status is required", 400));

  let comment = await Comments.findById(id);

  comment.status = status;
  await comment.save();

  return sendResponse(res, 201, "Comment is Approved");
});

export const getAllCommentsOfPosts = TryCatchHandler(async (req, res, next) => {
  const postId = req?.params?.postId;

  if (!postId) return next(new ErrorHandler("PostId", 400));

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filterOpt =
    req?.user?.role === "user" ? { postId, status: "Approved" } : { postId };
  const allComments = await Comments.find({ ...filterOpt })
    .populate("userId", "emailOrUserName")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const commentCount = await Comments.countDocuments({ ...filterOpt });

  return sendResponse(res, 200, "", { allComments, commentCount });
});
