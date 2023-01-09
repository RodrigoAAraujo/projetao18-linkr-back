import { Router } from "express";
import { postPosts, getPosts, teste } from "../controllers/timeline.controllers.js";


const router = Router()

router.get("/timeline", getPosts)
router.post("/timeline", postPosts)
//router.get("/timeline", teste)

export default router