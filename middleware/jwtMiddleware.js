const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const excludedPaths = ['/user/signin', '/user/register', '/'];
    if (excludedPaths.includes(req.path)) return next();

    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access Denied');

    try {
        const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Access Denied. Invalid Token');
    }
};

module.exports = verifyToken;
