import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //steps to resigter a user--->
  //Get data from the User
  //Check whether required datas are empty or not
  // validate the user data
  //check for image
  //upload them in cloudinary
  // create user object
  // remove password and refresh token from the response field
  // check for user creation
  // return res

  const { name, userName, password, email, dob } = req.body;
  if (!name || !userName || !email || !password) {
    console.log("error");
    throw new ApiError(400, "Please Provide every required details ");
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  
  const avatarLocalPath = req.files?.avatar ? req.files?.avatar[0]?.path :""; 
  const coverImageLocalPath = req.files?.coverImage ? req.files?.coverImage[0]?.path :"";

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required in local Path");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    name,
    userName:userName.toLowerCase(),
    email,
    password,
    dob,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if(!createdUser){
    throw new ApiError(500,"Something went Wrong while registering the user!")
  }
  return  res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
  )
});

export { registerUser };
