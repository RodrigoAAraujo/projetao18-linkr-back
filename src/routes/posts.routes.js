import { Router } from "express";
import { likePost, removeLike, verifyLike } from "../controllers/posts.controller.js";

const router = Router();

router.post("/posts/like/:id", likePost);
router.delete("/posts/removelike/:id", removeLike);
router.get("/posts/likes/:id", verifyLike)

export default router;