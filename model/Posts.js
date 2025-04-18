import mongoose from "mongoose";

export const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    default: [],
  },
},{timestamps:true});

export const Posts = new mongoose.model("Posts", PostSchema);
