import { Router } from "express";
import { postPosts, getPosts } from "../controllers/timeline.controllers.js";


const router = Router()

router.get("/timeline", getPosts);
router.post("/timeline", postPosts);

export default router