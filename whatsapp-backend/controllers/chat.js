const User = require('../models/user');
const Chat = require('../models/chat');

const handleGetChatById = async (req, res) => {
    const { chatId } = req.params;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Get Chat By Id", error: err.message });
    }
}

const handleGetChatByParticipants = async (req, res) => {
    const { receiverId } = req.params;
    const loggedInUserId = req.user.id;
    // participants
    try {
        const isUser = await User.findById(loggedInUserId);
        if (!isUser) {
            return res.status(404).json({ message: 'Invalid chat request' });
        }
        const chat = await Chat.find({ participants: { $all: [loggedInUserId, receiverId] } });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Get Chat By Participants", error: err.message });
    }
}


// Function to handle adding a new notification
const handleCreateChat = async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    // participants
    try {
        const isBothUsers = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
        ]);
        if (!isBothUsers[0] || !isBothUsers[1]) {
            return res.status(404).json({ message: 'Invalid chat request' });
        }
        // Ensure sender is not the receiver
        if (senderId === receiverId) {
            return res.status(400).json({ message: 'You cannot send a notification to yourself' });
        }
        if(!isBothUsers[0].friends.includes(receiverId) || !isBothUsers[1].friends.includes(senderId)){
            return res.status(404).json({ message: 'You are not friends' });
        }

        // Ensure sender exists
        const isChat = await Chat.findOne({
            participants: [senderId, receiverId],
            isGroupChat: false
        });
        if (isChat) {
            return res.status(404).json({ message: 'Chat already exists' });
        }

        // Create and save the notification
        const createdChat = new Chat({
            participants: [senderId, receiverId]
        })
        const savedChat = await createdChat.save();
        const savedChatsToUsers = await Promise.all([
            User.findByIdAndUpdate(senderId, { $addToSet: { chats: savedChat._id } }, { new: true }),
            User.findByIdAndUpdate(receiverId, { $addToSet: { chats: savedChat._id } }, { new: true }),
        ]);
        res.status(200).json(savedChat);
    } catch (err) {
        return res.status(400).json({ message: "Internal Server Error: Create Chat", error: err.message });
    }
}


const handleDeleteChat = async (req, res) => {
    const chatId = req.params.id;
    try{
        const isChat = await Chat.findById(chatId);
        if(!isChat){
            return res.status(404).json({ message: "Chat Not Found" })
        }
        if(isChat.isGroupChat){
            return res.status(400).json({ message: "This is a group chat" });
        }

        const [senderId, receiverId] = isChat.participants;
        const usersInChat = await Promise.all([
            User.findByIdAndUpdate(senderId, { $pull: { chats: chatId } }, { new: true }),
            User.findByIdAndUpdate(receiverId, { $pull: { chats: chatId } }, { new: true }),
        ]);
        if(!usersInChat){
            return res.status.json({ message: "Chat Deleted Faild from users data" });
        }

        const deletedChat = await Chat.findByIdAndDelete(chatId);
        if(!deletedChat){
            return res.status(400).json({ message: "Chat Deleted Faild" })
        }
        return res.status(200).json({ message: "Chat Deleted", chatId: deletedChat._id });
    }catch(error){
        return res.status(400).json({ message: "Internal server error: Delete Chat", error })
    }
}

module.exports = {
    handleCreateChat,
    handleDeleteChat,
    handleGetChatByParticipants,
    handleGetChatById
}