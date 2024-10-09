import { Router } from "express";
import { addLiketoPost, removeLiketoPost } from "../controllers/postLike.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);

router.route("/:postId/add-like").post(addLiketoPost);
router.route("/:postId/remove-like").delete(removeLiketoPost);

export default router;