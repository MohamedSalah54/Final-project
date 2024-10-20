import express from "express";
import { getFeedPosts, getUserPosts, likePost } from '../controller/post.controller.js'
import { protectRoute } from "../middleWare/protectRoute.js";

const router = express.Router();

/* READ */
router.get("/", protectRoute, getFeedPosts);
router.get("/:userId/posts", protectRoute, getUserPosts);

/* UPDATE */
router.patch("/:id/like", protectRoute, likePost);

export default router;