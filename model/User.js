import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    emailOrUserName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    posts: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Posts",
        },
      ],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET);
};

export const User = new mongoose.model("User", userSchema);
