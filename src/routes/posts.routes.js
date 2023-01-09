import { Router } from "express";
import { likePost, removeLike, verifyLike,  sendMetaData} from "../controllers/posts.controller.js";
import authValidation from "../middlewares/authValidation.js";

const router = Router();

router.use(authValidation)

router.post("/posts/like/:id", likePost);
router.delete("/posts/removelike/:id", removeLike);
router.get("/posts/likes/:id", verifyLike)
router.post("/posts/links", sendMetaData)

export default router;