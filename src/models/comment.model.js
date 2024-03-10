import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    }

},{timestamps:true});


export const Comment = mongoose.model("Comment",commentSchema);