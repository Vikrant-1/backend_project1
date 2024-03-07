import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getVideoById = async(videoId)=>{
    if(!videoId) throw new ApiError(404,'Video not found');
    const video = await Video.findById(videoId);
    if(!video)throw new ApiError(404,'Video not found');
    return video;
};

const uploadVideo = asyncHandler(async (req, res) => {

    const { title = '', description = '', isPublished = true } = req.body || {};
    const userId = req.user?._id;
    const localVideoFilePath = req.files?.videoFile?.[0].path;
    const localThumbnailPath = req.files?.thumbnail?.[0].path;

    if (!title || !description) {
        throw new ApiError(400, "Title and Description Required");
    }

    if (!localVideoFilePath) {
        return res.status(400).json(new ApiError(400, "Video is required!"));
    }
    if (!localThumbnailPath) {
        return res.status(400).json(new ApiError(400, "Thumbnail is required!"));
    }

    const videoFile = await uploadOnCloudinary(localVideoFilePath);
    if (!videoFile) {
        return res.status(400).json(new ApiError(400, "Video is required!"));
    }

    const thumbnail = await uploadOnCloudinary(localThumbnailPath);
    if (!thumbnail) {
        return res.status(400).json(new ApiError(400, "Thumbnail is required!"));
    }

    const video = await Video.create({
        videoFile: videoFile?.url || "",
        thumbnail: thumbnail?.url || "",
        title,
        description,
        isPublished,
        owner: userId,
        duration: videoFile?.duration || 0,
    });

    res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"));

});

// publish video
const publishVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.body;
    const video = await  getVideoById(videoId);
    if(video.isPublished === true){
        res.status(200).json(new ApiResponse(200,video,"Video is already published"));
    }
    video.isPublished = true;
    await video.save();
    res.status(200).json(new ApiResponse(200,video,"Video published successfully!"));
});
// unpublish video
const unPublishVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.body;
    const video = await getVideoById(videoId);
    if(video.isPublished === false){
        res.status(200).json(new ApiResponse(200,video,"Video is already unPublished"));
    }
    video.isPublished = false;
    await video.save();
    res.status(200).json(new ApiResponse(200,video,"Video unPublished successfully!"));
});

// title , description;
const updateVideoDetails = asyncHandler(async (req, res) => {
    // title or description hai ya nhi
    const { title = '', description = '', videoId } = req.body || {};
    if (!videoId) {
        throw new ApiError(404, "Video not found!");
    }
    if (!title && !description) {
        throw new ApiError(422, "Please provide title or description");
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, { $set: { ...(title && { title }), ...(description && { description }) } }, { new: true });
    if(!updatedVideo){
        throw new ApiError(500,"Falied to update details");
    }
    res.status(200).json(new ApiResponse(200,updatedVideo,"Successfully update the details."));
});

const updateThumbNail = asyncHandler(async (req, res) => {
    const {videoId} = req.body;
    const localThumbnailPath = req.file?.path;

    const video = await getVideoById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }

    if(!localThumbnailPath) throw new ApiError(400,"Please provide thumbnail image");

    const thumbnail = await uploadOnCloudinary(localThumbnailPath);

    if(!thumbnail) throw new ApiError(400,'Failed to upload thumbnail');
    video.thumbnail = thumbnail.url;
    await video.save();
    await deleteOnCloudinary()
    res.status(200).json(new ApiResponse(200,video,'Thumbnail updated succesfully'));
});

// views
const handleViews = asyncHandler(async (req, res) => {

});

// handle delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.body;
    if(!videoId){
        throw new ApiError(400, "Video not Found!");
    }
    await Video.findByIdAndDelete(videoId);
    res.status(200).json(new ApiResponse(200,{},"Video deleted succesfully!"));
});



export { uploadVideo, publishVideo, unPublishVideo, updateThumbNail, updateVideo, handleViews, deleteVideo, updateVideoDetails };
