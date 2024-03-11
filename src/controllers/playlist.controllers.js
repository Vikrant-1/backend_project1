import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name = '', description = '', videos = [] } = req.body;
    const userId = req.user?._id;
    if (!name) throw new ApiError(400, 'Playlist name required');

    const playlist = await Playlist.create({
        name,
        description: description ?? '',
        owner: userId,
        videos,
    });
    if (!playlist) throw new ApiError(400, 'Unable to create playlist');
    res.status(200).json(new ApiResponse(200, playlist, 'Playlist create Successfully'));

});

// get Playlist by Id -> findById
// get users all playlist -> find
// Home Work  name description -> update  -> //? DONE

const getPlaylist = asyncHandler(async (req, res) => {

    try {
        const userId = req.user?._id;
        const playlistId = req.params?.playlistId;

        if (!playlistId) throw new ApiError(404, 'Playlist not found');

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) throw new ApiError(400, 'Playlist not updated');

        res.status(200).json(new ApiResponse(200,playlist,'Playlist fetched successfully'));
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            res.status(400).json({ message: 'Invalid playlist ID or data' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }



});

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const playlists = await Playlist.find({owner:userId});

    if(!playlists) throw new ApiError(404,'Playlist not found');

    res.status(200).json(new ApiResponse(200,playlists,'Playlists fetch successfully'));

});



const updatePlaylist = asyncHandler(async (req, res) => {

    try {
        const userId = req.user?._id;
        const playlistId = req.params?.playlistId;
        const { name = '', description = '' } = req.body;

        if (!name && !description) throw new ApiError(400, 'Name or Description is required');

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    ...(name && { name }),
                    ...(description && { description }),
                }
            }
            , { new: true }
        );

        if (!playlist) throw new ApiError(400, 'Falied to update playlist');
        res.status(200).json(new ApiResponse(200, playlist, 'Playlist updated successfully'));
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            res.status(400).json({ message: 'Invalid playlist ID or data' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }

    }
});

const updatePlaylistVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const playlistId = req.params?.playlistId;
    const { videos = [] } = req.body;
    if (!Array.isArray(videos)) throw new ApiError(400, 'Videos is not valid');
    if (!playlistId) throw new ApiError(404, 'Playlist not found');
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, 'Playlist not found');
    if (!userId.equals(playlist?.owner)) throw new ApiError(400, 'You dont have access to update this playlist')
    playlist.videos = videos;
    await playlist.save();
    res.status(200).json(new ApiResponse(200, playlist, 'Playlist videos updated succesfully'));
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const playlistId = req.params?.playlistId;
    if (!playlistId) throw new ApiError(404, 'Playlist not found');

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, 'Playlist not found');
    if (!userId.equals(playlist?.owner)) throw new ApiError(400, 'Owner have access to delete Playlist');

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) throw new ApiError(400, ' Failed to delete playlist');

    res.status(200).json(new ApiResponse(200, deletedPlaylist, 'Playlist deleted successfully'));
});

export { createPlaylist, deletePlaylist, updatePlaylistVideos, updatePlaylist, getPlaylist,getUserPlaylists };