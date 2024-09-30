import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deletePost, getAllPost, getPostById, getPostByNum, updatePost, uploadPost } from "../controllers/post.controller.js";

const router = Router();
router.use(verifyJWT); // this actually checks user jwt for all this routes

router.route('/:id/all-posts').get(getAllPost);
router.route('/:id').get(getPostByNum); // for post pagination
router.route('/post-id/:id').get(getPostById);
router.route('/upload').post(
    upload.fields([
        {
            name:'postImg',
            maxCount:2,
        },
        {
            name:'postVid',
            maxCount:1,
        }
    ]),
    uploadPost
);
router.route('/update/:id').patch(updatePost);
router.route('/delete/:id').delete(deletePost);
export default router;