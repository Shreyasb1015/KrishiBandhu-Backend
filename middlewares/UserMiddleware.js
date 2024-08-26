const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/APIResponse');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) return res.status(401).json(new APIResponse(null, 'No authorization header provided').toJson());
    
    const token = authHeader.split(' ')[1]; // Extract token part from "Bearer <token>"
    if (!token) return res.status(401).json(new APIResponse(null, 'No token provided').toJson());
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json(new APIResponse(null, 'Invalid token').toJson());
        
        // Attach user data to req object
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        
        next(); // Pass control to the next middleware or route handler
    });
};

module.exports = verifyToken;
