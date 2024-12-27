const express = require("express");
const Router = express.Router();

const {
    handleCreateChat,
    handleDeleteChat,
    handleGetChatByParticipants,
    handleGetChatById
} = require("../controllers/chat");
const {
    authenticateToken
} = require("../middlewares/index");

Router.get('/:chatId', authenticateToken, handleGetChatById);
Router.get('/participants/:receiverId', authenticateToken, handleGetChatByParticipants);
Router.post('/', authenticateToken, handleCreateChat);
Router.delete('/:id', authenticateToken, handleDeleteChat);

module.exports = Router