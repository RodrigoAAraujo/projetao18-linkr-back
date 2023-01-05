import { Router } from "express";
import { likePost, removeLike } from "../controllers/posts.controller.js";

const router = Router();

router.post("/posts/like/:id", likePost)
router.delete("posts/deletelike", removeLike)

export default router;