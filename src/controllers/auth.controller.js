import User from "../models/user.model.js";
import cloudinary from "../utils/cloudnary.js";
import { generateToken } from "../utils/generateToken.js";
import { generatePassword, verifyPassword } from "../utils/password.js";

export const signup = async (req, res) => {
  const { username, email, password, birthday } = req.body;

  try {
    if (!username || !email || !password || !birthday) {
      return res.status(400).json({
        message: "Enter all fields",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const today = new Date();
    const birthDate = new Date(birthday);

    if (birthDate > today) {
      return res.status(400).json({
        message: "Birthday can't be in the future",
      });
    }

    const hashedPassword = await generatePassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      birthday: birthDate,
    });

    await newUser.save();

    generateToken(newUser, res);

    req.app.get("io").emit("onlineUser", newUser._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        birthday: newUser.birthday,
        profile: newUser.profile,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user, res);

    req.app.get("io").emit("onlineUser", user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signin error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User verified",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
