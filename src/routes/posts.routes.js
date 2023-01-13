import { Router } from "express";
import { likePost, removeLike, verifyLike,  sendMetaData, sendUserPosts, deletePost, addComment, loadComments} from "../controllers/posts.controller.js";
import authValidation from "../middlewares/authValidation.js";

const router = Router();

router.use(authValidation)

router.post("/posts/like/:id", likePost);
router.delete("/posts/removelike/:id", removeLike)
router.delete("/posts/:id", deletePost)
router.get("/posts/likes/:id", verifyLike)
router.post("/posts/links", sendMetaData)
router.post("/posts/addcomment", addComment)
router.get("/posts/loadcomments", loadComments)
router.get("/posts/users/:id", sendUserPosts)

export default router;