import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadVideo } from "../controllers/video.controllers.js";

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


export default router;