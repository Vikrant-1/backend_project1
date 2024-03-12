import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    referenceType: {
        type: String,
        required: true,
        enum: ["Comment", "Video", "Tweet"]
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, { timestamps: true });
likeSchema.index({ referenceId: 1, referenceType: 1, likedBy: 1 });
const Like = model('Like', likeSchema);


export { Like };