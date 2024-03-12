import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createLike, deleteLike, getLikes } from "../controllers/like.controllers.js";

const router = Router();

router.route('/').post(verifyJWT,createLike);
router.route('/:likeId').delete(verifyJWT,deleteLike);
router.route('/referenceType/:referenceType/referenceId/:referenceId').get(verifyJWT,getLikes);


export default router;