import { Router } from "express";
import { likePost, removeLike, verifyLike,  sendMetaData, sendUserPosts} from "../controllers/posts.controller.js";
import authValidation from "../middlewares/authValidation.js";

const router = Router();

router.post("/posts/like/:id", authValidation, likePost);
router.delete("/posts/removelike/:id", authValidation, removeLike);
router.get("/posts/likes/:id", authValidation, verifyLike)
router.post("/posts/links", authValidation, sendMetaData)
router.get("/posts/users/:id", authValidation, sendUserPosts)

export default router;