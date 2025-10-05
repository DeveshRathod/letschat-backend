import User from "../models/user.model.js";

export const sendRequest = async (req, res) => {
  const { identifier } = req.body;
  const user = req.user;

  try {
    const targetUser = await User.findById(identifier);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (targetUser._id.equals(user._id)) {
      return res.status(400).json({
        message: "You cannot send a request to yourself.",
      });
    }

    if (targetUser.friends.includes(user._id)) {
      return res.status(400).json({
        message: "You are already friends.",
      });
    }

    if (targetUser.requests.includes(user._id)) {
      return res.status(400).json({
        message: "Friend request already sent.",
      });
    }

    targetUser.requests.push(user._id);
    await targetUser.save();

    return res.status(200).json({
      message: "Friend request sent successfully.",
    });
  } catch (error) {
    console.error("Friend request error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const search = async (req, res) => {
  const { identifier } = req.body;

  if (!identifier || typeof identifier !== "string") {
    return res.status(400).json({ message: "Identifier is required." });
  }

  try {
    const regex = new RegExp("^" + identifier, "i");

    const currentUserId = req.user?._id || req.user || null;

    const users = await User.find({
      $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
      _id: { $ne: currentUserId },
    })
      .select("_id username email profile")
      .limit(10);

    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const acceptFriend = async (req, res) => {
  const { requesterId } = req.body;
  const currentUser = req.user;

  try {
    const user = await User.findById(currentUser._id);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.requests.includes(requesterId)) {
      return res.status(400).json({ message: "No friend request found." });
    }

    user.friends.push(requesterId);
    requester.friends.push(user._id);

    user.requests = user.requests.filter((id) => id.toString() !== requesterId);
    requester.requests = requester.requests.filter(
      (id) => id.toString() !== user._id.toString()
    );

    await user.save();
    await requester.save();

    return res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error("Accept Friend Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const currentUser = req.user;

  try {
    const user = await User.findById(currentUser._id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found." });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);

    // friend.friends = friend.friends.filter(
    //   (id) => id.toString() !== currentUser._id.toString()
    // );

    await user.save();
    await friend.save();

    return res.status(200).json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Remove Friend Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("friends", "_id username profile")
      .lean();

    if (user && user.friends) {
      user.friends = Array.from(
        new Map(user.friends.map((f) => [f._id.toString(), f])).values()
      );
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getRequests = async (req, res) => {
  const user = req.user;

  try {
    const currentUser = await User.findById(user.id).lean();

    if (
      !currentUser ||
      !currentUser.requests ||
      currentUser.requests.length === 0
    ) {
      return res.status(200).json({ requests: [] });
    }

    const requestUsers = await User.find({ _id: { $in: currentUser.requests } })
      .select("_id username email profile")
      .lean();

    res.status(200).json(requestUsers);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
};

export const getFriend = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user.id;

  if (!chatId) {
    return res.status(400).json({ message: "chatId is required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user || !user.friends.includes(chatId)) {
      return res.status(404).json({ message: "Friend not found." });
    }

    const friend = await User.findById(chatId).select("username profile");

    if (!friend) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      username: friend.username,
      profile: friend.profile,
    });
  } catch (error) {
    console.error("Error in getFriend:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
