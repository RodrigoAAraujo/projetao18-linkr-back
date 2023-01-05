import { Router } from "express";
import { likePost, removeLike } from "../controllers/posts.controller";

const router = Router();

router.post("/posts/postlike", likePost)
router.delete("posts/deletelike", removeLike)

export default router;