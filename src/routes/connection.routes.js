import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followUser, getFollowers, getFollowings, unFollowUser } from "../controllers/connection.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/follow/:id").post(followUser);
router.route("/unfollow/:id").delete(unFollowUser);
router.route("/get-followings/:id").get(getFollowings);
router.route("/get-followers/:id").get(getFollowers);

export default router;