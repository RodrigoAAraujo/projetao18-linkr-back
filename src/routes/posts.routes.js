import { Router } from "express";
import { likePost, removeLike, verifyLike,  sendMetaData, sendUserPosts, deletePost} from "../controllers/posts.controller.js";
import authValidation from "../middlewares/authValidation.js";

const router = Router();

router.use(authValidation)

router.post("/posts/like/:id", likePost);
router.delete("/posts/removelike/:id", removeLike)
router.delete("/posts/:id", deletePost)
router.get("/posts/likes/:id", verifyLike)
router.post("/posts/links", sendMetaData)
router.get("/posts/users/:id", sendUserPosts)

export default router;