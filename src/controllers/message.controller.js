import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  const { receiverId } = req.body || {};
  const user = req.user;

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user._id, receiverId },
        { senderId: receiverId, receiverId: user._id },
      ],
    })
      .sort("createdAt")
      .populate("senderId", "username profile")
      .populate("receiverId", "username profile");

    const enriched = messages.map((msg) => ({
      _id: msg._id,
      text: msg.text,
      isRead: msg.isRead,
      createdAt: msg.createdAt,

      sender: {
        _id: msg.senderId._id,
        username: msg.senderId.username,
        profile: msg.senderId.profile,
      },
      receiver: {
        _id: msg.receiverId._id,
        username: msg.receiverId.username,
        profile: msg.receiverId.profile,
      },
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;

  if (senderId.toString() === receiverId) {
    return res.status(400).json({ message: "Can't send message to yourself" });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    const saved = await newMessage.save();

    const enriched = await Message.findById(saved._id)
      .populate("senderId", "username profile")
      .populate("receiverId", "username profile");

    const responseMessage = {
      _id: enriched._id,
      text: enriched.text,
      isRead: enriched.isRead,
      createdAt: enriched.createdAt,

      sender: {
        _id: enriched.senderId._id,
        username: enriched.senderId.username,
        profile: enriched.senderId.profile,
      },
      receiver: {
        _id: enriched.receiverId._id,
        username: enriched.receiverId.username,
        profile: enriched.receiverId.profile,
      },
    };

    req.app.get("io").emit("message", responseMessage);

    res.status(201).json({
      message: "Message sent successfully",
      data: responseMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const clear = async (req, res) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ message: "All messages cleared." });
  } catch (error) {
    console.error("Error clearing messages:", error);
    res.status(500).json({ message: "Failed to clear messages." });
  }
};
