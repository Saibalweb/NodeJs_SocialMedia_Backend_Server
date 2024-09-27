import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadPost } from "../controllers/post.controller.js";

const router = Router();
router.use(verifyJWT); // this actually checks user jwt for all this routes

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
export default router;