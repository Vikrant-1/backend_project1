import { Router } from "express";
import { createTweet, deleteTweet, updateTweet } from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').post(verifyJWT,createTweet);
router.route('/:tweetId').put(verifyJWT,updateTweet);
router.route('/:tweetId').delete(verifyJWT,deleteTweet);

export default router;