import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating refresh and access token');
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user from frontend
    // validation - not empty
    // check if user already exist: username email
    // check for images ,check for avatar
    // upload them to cloudinary,avtar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response
    const {
        fullName,
        email,
        username,
        password,
    } = req.body || {};

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) throw new ApiError(400, "Avatar file is required");

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) throw new ApiError(500, 'Somethimg went wrong while registering the user');

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    );

})

const loginUser = asyncHandler(async (req, res) => {
    // username ,  email -> is there
    // validate field
    // password exist
    // is user exist
    //  token
    // login


    const { username = '', email = '', password = '' } = req.body || {};
    if (!username || !email) throw new ApiError(400, 'username or email required');

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) throw new ApiError(404, "User does not exist.");

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) throw ApiError(401, "Invalid Password");

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user);

    const loggedInUser = user.select("-password -refreshToken");

    const options = {
        http: true,
        secure: true,
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken,
        }, 'User loggedin successfully'));

})


const logoutUser = asyncHandler(async(req,res)=>{
    // find user,
   await User.findByIdAndUpdate(req?.user?._id,{$set:{refreshToken:undefined}},{new:true});

   const options = {
    http: true,
    secure: true
};

 return res.status(200)
 .clearCookie('accessToken',options)
 .clearCookie('refreshToken',options)
 .json(new ApiResponse(200,{},'Successfully logged out user'));
    
})


export { registerUser ,loginUser ,logoutUser};