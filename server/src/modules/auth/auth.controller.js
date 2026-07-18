import User from "../users/user.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const newUser = new User({
    name,
    email,
    password,
    role: "CUSTOMER",
  });
  await newUser.save();

  const token = newUser.generateToken();
  const userData = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  return res
    .status(201)
    .json(
      new ApiResponse(
        { user: userData, token },
        "User registered successfully",
      ),
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateToken();
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return res
    .status(200)
    .json(
      new ApiResponse({ user: userData, token }, "User logged in successfully"),
    );
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return res
    .status(200)
    .json(
      new ApiResponse({ user: userData }, "User details fetched successfully"),
    );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(null, "Password changed successfully"));
});

export const logoutUser = (req, res) => {
  return res.status(200).json(new ApiResponse(null, "Logged out successfully"));
};
