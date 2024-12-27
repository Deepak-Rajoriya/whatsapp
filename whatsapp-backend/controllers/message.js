const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

// Handle Signup
const handleCreateMsg = async (req, res) => {
    const senderId = req.user.id;
    const {receiverId, chatId, content} = req.body;

    try {
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: "Receiver or Sender Not Found" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        const message = new Message({senderId, receiverId, content, chatId});
        const savedMsg = await message.save();

        const updatedChat = await Chat.findByIdAndUpdate(chatId, { lastMessage: content }, { new: true });

        if (!savedMsg || !updatedChat) {
            return res.status(400).json({ message: "Message Not Saved" });
        }
        return res.status(200).json({ message: "Message Sent Successfully", data: message });
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Create Message", error: err.message });
    }
}

const handleGetMsg = async (req, res) => {
    const {chatId} = req.params;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }
        const messages = await Message.find({ chatId });
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Get Messages", error: err.message });
    }
}

const handleDeleteMsg = async (req, res) => {
    const msgId = req.params.id;
    try {
        const message = await Message.findByIdAndDelete(msgId);
        if (!message) {
            return res.status(404).json({ message: "Message Not Found" });
        }
        return res.status(200).json({ message: "Message Deleted Successfully" });
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Delete Message", error: err.message });
    }
}

module.exports = {
    handleCreateMsg,
    handleGetMsg,
    handleDeleteMsg
}