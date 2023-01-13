import { Router } from "express";
import { selectPostsWithHashtag, selectTrendingHashtags } from "../controllers/hashtags.controller.js";

const router = Router();

router.get("/trending", selectTrendingHashtags);
router.get("/trending/:hashtag", selectPostsWithHashtag);

export default router;