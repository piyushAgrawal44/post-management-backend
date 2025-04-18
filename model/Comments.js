import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending",
  },
},{timestamps:true});

export const Comments = new mongoose.model("Comments", CommentSchema);
