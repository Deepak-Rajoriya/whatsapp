const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || null;

const authenticateToken = (req, res, next) => {
    try {
        if(!SECRET_KEY){
            return res.status(401).json({ message: `SECRET KEY is ${SECRET_KEY}`});
        }

        // Get the token directly from the headers
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            return res.status(401).json({ message: "Authorization token is missing."});
        }
        const token = bearerToken.split(" ")[1];
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = { authenticateToken };