const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const handleGetAllUsers = async (req, res) => {
    const loggedInUser = req.user;
    try {
        // Check - loggedInUser - Exists
        // -----------Remaining----------
        const allUsers = await User.find({ _id: { $ne: loggedInUser.id } });
        return res.status(200).json(allUsers);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Handle Signup
const handleCreateUser = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const findUser = await User.findOne({
            username,
            email
        });
        if (findUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        });
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (err) {
        return res.status(400).json({ message: "Please Enter valid Details", error: err.message });
    }
}

// Handle Get user by Id
const handleGetUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({ message: "User Not Found" });
    }
}

// Handle Update User
const handleUpdateUserById = async (req, res) => {
    const userId = req.user.id;
    const {name, email, phone, bio} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, usermeta: { phone, bio } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        res.status(200).json({ message: "User Updated", id: updatedUser._id });
    } catch (err) {
        return res.status(400).json({ message: "User Not Found" });
    }
}

// Handle delete user by id
const handleDeleteUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        res.status(200).json({ message: "User Deleted", id: deletedUser._id });
    } catch (err) {
        return res.status(400).json({ message: "User Not Found" });
    }
}

module.exports = {
    handleGetAllUsers,
    handleCreateUser,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById
}