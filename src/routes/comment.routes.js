import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteComment, getAllcomments, updateComment, uploadComment } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT)
//all comment routes
router.route('/upload').post(uploadComment);
router.route('/update/:id').patch(updateComment);
router.route('/delete/:id').delete(deleteComment);
router.route('/:postId/all-comments').get(getAllcomments);
export default router;