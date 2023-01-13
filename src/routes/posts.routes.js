import { Router } from "express";
import { likePost, removeLike, verifyLike,  sendMetaData, sendUserPosts, deletePost, addComment, loadComments, updatePost} from "../controllers/posts.controller.js";
import authValidation from "../middlewares/authValidation.js";
import { validateUpdatePost } from "../middlewares/posts.middlewares.js";

const router = Router();

router.use(authValidation)

router.post("/posts/like/:id", likePost);
router.delete("/posts/removelike/:id", removeLike)
router.delete("/posts/:id", deletePost)
router.get("/posts/likes/:id", verifyLike)
router.post("/posts/links", sendMetaData)
router.post("/posts/comments", addComment)
router.get("/posts/comments/:id", loadComments)
router.get("/posts/users/:id", sendUserPosts)
router.put("/posts/:id", validateUpdatePost,updatePost)

export default router;