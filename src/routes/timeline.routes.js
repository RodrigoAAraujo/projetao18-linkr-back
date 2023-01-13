import { Router } from "express";
import { postPosts, getPosts } from "../controllers/timeline.controllers.js";
import authValidation from "../middlewares/authValidation.js";
import { validatePost } from "../middlewares/posts.middlewares.js";


const router = Router()

router.get("/timeline", authValidation, getPosts)
router.post("/timeline",authValidation, validatePost, postPosts)

export default router