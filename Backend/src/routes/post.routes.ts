import express from "express";
import { verifyToken, isUser } from "../controllers/authController";
import {
  addpost,
  bookpost,
  deletepost,
  editpost,
  fetchPosts,
  getPost,
  getUserPosts,
  markascomplete,
} from "../controllers/postController";
import { validatePostSchema } from "../models/post/validateSchema";
import { postschema } from "../models/post/postmodel";
import { isAuthor } from "../middleware/isAuthorMiddleware";
import { isBooked, isFree } from "../middleware/ridesMiddleware";
import { filterPosts } from "../controllers/filterController";

export const postrouter = express.Router();
postrouter.post(
  "/addpost",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  addpost
);
postrouter.get("/fetchpublishedposts", verifyToken, isUser, fetchPosts);
postrouter.post("/fetchfilteredposts", verifyToken, isUser, filterPosts);
postrouter.post(
  "/editpost",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  isAuthor,
  editpost
);
postrouter.post(
  "/deletepost",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  isAuthor,
  deletepost
);
postrouter.post(
  "/bookpost",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  isFree,
  isBooked,
  bookpost
);
postrouter.post(
  "/isBooked",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  isBooked,
  (req, res) => {
    res.status(205).json({ message: "Not booked" });
  }
);
postrouter.get("/getAllUserPosts", verifyToken, isUser, getUserPosts);
postrouter.get("/getpost/:id", verifyToken, isUser, getPost);
postrouter.post(
  "/markascomplete",
  verifyToken,
  isUser,
  validatePostSchema(postschema),
  isAuthor,
  markascomplete
);
