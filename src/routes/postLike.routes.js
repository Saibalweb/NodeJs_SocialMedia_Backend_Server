import { Router } from "express";
import { addLiketoPost, removeLiketoPost } from "../controllers/postLike.controller.js";
const router = Router();

router.route("/:postId/addLike").post(addLiketoPost);
router.route("/:postId/removeLike").delete(removeLiketoPost);

export default router;