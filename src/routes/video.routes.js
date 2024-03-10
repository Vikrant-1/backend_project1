import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishVideo, unPublishVideo, uploadVideo } from "../controllers/video.controllers.js";
import { createComment, deleteComment, updateComment } from "../controllers/comment.controllers.js";

const router = Router();


// routes

router.route('/upload-video').post(
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
);
router.route('/publish-video/:videoId').patch(verifyJWT,publishVideo);
router.route('/unpublish-video/:videoId').patch(verifyJWT,unPublishVideo);
router.route('/:videoId/comments').post(verifyJWT,createComment);
router.route('/:videoId/comments/:commentId').put(verifyJWT,updateComment);
router.route('/:videoId/comments/:commentId').delete(verifyJWT,deleteComment);



export default router;