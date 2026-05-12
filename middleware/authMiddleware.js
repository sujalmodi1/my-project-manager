const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('Authorization');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Move to the next function (the actual route)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};