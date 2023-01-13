import { Router } from "express";
import { selectTrendingHashtags } from "../controllers/hashtags.controller.js";

const router = Router();

router.get("/trending", selectTrendingHashtags);

export default router;