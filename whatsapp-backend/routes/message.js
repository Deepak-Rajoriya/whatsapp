const express = require("express");
const Router = express.Router();

const {
        handleCreateMsg,
        handleGetMsg,
        handleDeleteMsg
} = require("../controllers/message")

const { authenticateToken } = require("../middlewares/index")

Router.post('/', authenticateToken, handleCreateMsg); // Register New User
Router.get('/:chatId', authenticateToken, handleGetMsg); // Register New User
Router.delete('/:id', authenticateToken, handleDeleteMsg); // Register New User

module.exports = Router