import express from "express";
import { getFeedPosts, getUserPosts, likePost , commentOnPost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
// import { verify } from "jsonwebtoken";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment" , verifyToken , commentOnPost);

export default router;
