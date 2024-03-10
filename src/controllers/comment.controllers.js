import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createComment = asyncHandler(async(req,res)=>{
    const content = req.body?.content;
    const videoId = req.params?.videoId;
    const userId = req.user?._id;

    // const video = await Video.findById(videoId);
    // // compare video id -> verify it

    console.log(content,videoId,userId);
    res.status(200).json({content,videoId,userId});


    
});

const updateComment = asyncHandler(async(req,res)=>{
    
    const content = req.body?.content;
    const {videoId , commentId} = req.params;
    const userId = req.user?._id;

    // const video = await Video.findById(videoId);
    // // compare video id -> verify it

    console.log(content,videoId,userId,commentId);
    res.status(200).json({content,videoId,userId,commentId});


});

const deleteComment = asyncHandler(async(req,res)=>{
    const content = req.body?.content;
    const {videoId , commentId} = req.params;
    const userId = req.user?._id;

    // const video = await Video.findById(videoId);
    // // compare video id -> verify it

    console.log(content,videoId,userId,commentId);
    res.status(200).json({content,videoId,userId,commentId});
    


});


export {createComment,updateComment,deleteComment};