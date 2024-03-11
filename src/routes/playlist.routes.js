import { Router } from "express";
import { createPlaylist, updatePlaylistVideos, deletePlaylist, updatePlaylist, getPlaylist, getUserPlaylists } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/').post(verifyJWT,createPlaylist);
router.route('/users/:userId').get(verifyJWT,getUserPlaylists);
router.route('/:playlistId').get(verifyJWT,getPlaylist);
router.route('/:playlistId').put(verifyJWT,updatePlaylistVideos);
router.route('/:playlistId/details').put(verifyJWT,updatePlaylist);
router.route('/:playlistId').delete(verifyJWT,deletePlaylist);


export default router;

