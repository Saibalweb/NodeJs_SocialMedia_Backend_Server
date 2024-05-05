import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went wrong while generating refresh and access token!",
    );
  }
};

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

  const avatarLocalPath = req.files?.avatar ? req.files?.avatar[0]?.path : "";
  const coverImageLocalPath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : "";

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
    userName: userName.toLowerCase(),
    email,
    password,
    dob,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went Wrong while registering the user!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //step to login user
  // get userName/email and password from user
  //search if there is any user with this email /userName
  // if yes then check the password of that user
  // if password match then generate token

  const { userName, email, password } = req.body;
  if (!userName && !email) {
    throw new ApiError(400, "Email or username is required!");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User doesn't Exists!");
  }
  if (!password) {
    throw new ApiError(402, "Please Enter Password!");
  }
  const validPassword = await user.checkPassword(password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "Logged In Successfully!",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Successfully logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "No token provided");
  }
  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN,
    );

    const user = User.findById(decodedToken.id);

    if (!user) {
      throw new ApiError(401, "Invalid RefreshToken!");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "RefreshToken is expired or used!");
    }

    const { accessToken, newRefreshToken } = generateAccessAndRefreshToken(
      user?._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiError(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "New Access Token and refreshToken Generated!",
        ),
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide old and new Password!");
  }
  const user = await findById(req.user._id);
  const isPasswordCorrect = await user.checkPassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Wrong Old Password!");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: "false" });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your password has changed!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully!"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(401, "Please provide avatar image!");
  }
  const response = await uploadOnCloudinary(avatarLocalPath);
  if (!response.url) {
    throw new ApiError(
      500,
      "Internal Server problem while uploading the image! Please try again",
    );
  }
  const user = await User.findByIdandUpdate(
    req.user?._id,
    {
      $set: {
        avatar: response.url,
      },
    },
    {
      new: true,
    },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Your Image is successfully uploaded"));
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(401, "Please provide avatar image!");
  }
  const response = await uploadOnCloudinary(coverImageLocalPath);
  if (!response.url) {
    throw new ApiError(
      500,
      "Internal Server problem while uploading the cover image! Please try again",
    );
  }
  const user = await User.findByIdandUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: response.url,
      },
    },
    {
      new: true,
    },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Your coverImage is successfully uploaded"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
};
