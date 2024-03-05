import {Router} from 'express';
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar } from '../controllers/user.controllers.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser
    );
router.route('/login').post(loginUser);

// secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/changepassword').put(verifyJWT,changeCurrentPassword);
router.route('/getuser').get(verifyJWT,getCurrentUser);
router.route('/updateavatar').put(verifyJWT,upload.single("avatar"),updateUserAvatar);


export default router;