const express = require("express");
const cors = require('cors');
const http = require("http");
const dotenv = require('dotenv');
const connectDB = require("./connection");
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { authenticateToken } = require("./middlewares/index");
// My Models
const User = require('./models/user');
const Notification = require('./models/notifications');

// My Routers
const userRouter = require("./routes/user");
const notificationRouter = require("./routes/notification");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

dotenv.config();
connectDB();

const app = express();
app.use(cors());

const server = http.createServer(app);
const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

let users = [];

// Connect to socket.io
socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        if (users.filter((user) => user.userName === data.userName).length === 0) {
            users.push(data);
        } else {
            users = users.filter((user) => user.userName !== data.userName); // Remove existing user
            users.push(data);
        }
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    // Listens and logs the message to the console
    socket.on('send_notification', (data) => {
        const receiverSocket = users.find((user) => user.userId === data.receiverId);

        if (receiverSocket && receiverSocket.socketID) {
            socketIO.to(receiverSocket.socketID).emit('receive_notification', data);
        } else {
            console.error('Invalid receiverSocket or socketID');
        }
    });

    // Listens and logs the message to the console
    socket.on('send_message', (data) => {
        const receiverSocket = users.find((user) => user.userId === data.receiverId);

        if (receiverSocket && receiverSocket.socketID) {
            socketIO.to(receiverSocket.socketID).emit('receive_message', data);
        } else {
            console.error('Invalid receiverSocket or socketID');
        }
    });

    // Disconnect User
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

// My Routers
app.use('/api/users', userRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        return res.status(200).json({ token });

    } catch (err) {
        return res.status(400).json({ message: "User Not Found" });
    }
})

// Get all friends by user
app.get('/api/current-user', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Logged In User Id
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ message: "Success", data: user });
    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error from Index.js", error })
    }
});

// Get all friends by user
app.get('/api/user/friends', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Logged In User Id
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const friendsArr = user.friends;
        const friends = await User.find({
            _id: { $in: friendsArr },
        });
        return res.status(200).json({ message: "Success", data: friends });
    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error Index.js", error })
    }
});

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});