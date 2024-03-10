import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const {content=''} = req.body;
    if(!content) throw new ApiError(400,'Please provide content');
    const tweet = await Tweet.create({
        content,
        owner:userId,
    });
    if(!tweet) throw new ApiError(400,'Falied to craete tweet');
    res.status(200).json(new ApiResponse(200,tweet,'Tweet created Sucessfully'));
});

const updateTweet = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const tweetId = req.params?.tweetId;
    const {content=''} = req.body;
    if(!content) throw new ApiError(400,'Please provide content');
    const tweet = await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(404,'Tweet not found');
    if(!userId.equals(tweet.owner)) throw new ApiError(400,'Only Owner have access to update the tweet');

    tweet.content = content;
    await tweet.save();

    res.status(200).json(new ApiResponse(200,tweet,'tweet updated successfully'));
});

const  deleteTweet = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const tweetId = req.params?.tweetId;
    const tweet = await Tweet.findById(tweetId);
    if(!tweet) throw new ApiError(404,'Tweet not found');
    if(!userId.equals(tweet.owner)) throw new ApiError(400,'Only Owner have access to update the tweet');
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    res.json(200).status(new ApiResponse(200,deletedTweet,'Tweet deleted successfully'));
});


export {createTweet,updateTweet,deleteTweet};