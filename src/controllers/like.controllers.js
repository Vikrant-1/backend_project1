import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getLikes = asyncHandler(async(req,res)=>{
    const {referenceType,referenceId} = req.params;
    if(!referenceType || !referenceId) throw new ApiError(400,"Provide referenceType and referenceId");
    if(!["Comment", "Video", "Tweet"].includes(referenceType)) throw new ApiError(400,'Provide valid referenceType');

    const likes = await Like.find({
        referenceId,
        referenceType
    });
    const likeCount = likes?.length ||0;

    res.status(200).json(new ApiResponse(200,{likes,likeCount},"Successfully fetched likes!"));
});

const createLike = asyncHandler(async(req,res)=>{
    const {referenceType,referenceId} = req.body;
    if(!referenceType || !referenceId) throw new ApiError(400,"Provide referenceType and referenceId");
    if(!["Comment", "Video", "Tweet"].includes(referenceType)) throw new ApiError(400,'Provide valid referenceType')
    const likedBy = req.user._id;
    const findLike = await Like.findOne({
        likedBy,
        referenceType,
        referenceId
    });
    if(findLike) return res.status(200).json((new ApiResponse(200,findLike,`${referenceType} is already Liked`)));

    const like = await Like.create({
        referenceType,
        referenceId,
        likedBy,
    })

    if(!like) throw new ApiError(400,'Falied to create Like');
    res.status(201).json(new ApiResponse(201,like,`Successfully liked ${referenceType}`));
});

const deleteLike = asyncHandler(async(req,res)=>{
    const {likeId} = req.params;
    if(!likeId) throw new ApiError(400,"Provide likeId");

    const deletedLike = await Like.findByIdAndDelete(likeId);
    if (!deletedLike) {
        return res.status(404).json({ message: 'Like not found' });
    }
    res.status(200).json(new ApiResponse(200,{},"Successfully delete like"));

});


export {getLikes,createLike,deleteLike};

