// Import the 'jsonwebtoken' library to handle JSON Web Tokens (JWTs)
const jwt = require('jsonwebtoken');

// Middleware function to check if the user is authenticated
module.exports = (req, res, next) => {
    // Get the token from the 'Authorization' header
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null; // Split 'Bearer token' format

    // If there's no token, send a 401 (Unauthorized) response
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the decoded user information to the request object
        req.user = decoded;

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid, send a 401 (Unauthorized) response
        res.status(401).json({ error: 'Invalid token' });
    }
};
