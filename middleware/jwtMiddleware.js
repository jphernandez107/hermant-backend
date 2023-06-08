const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const excludedPaths = ['/user/signin', '/user/register', '/'];
    if (excludedPaths.includes(req.path)) return next();

    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send({ auth: false, message: 'No token provided.' });

    try {
        const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error('Access Denied. Invalid Token');
        res.status(401).send({error, message:'Access Denied. Invalid Token'});
    }
};

function verifyRole(roleNeeded) {
    return function (req, res, next) {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).send({ auth: false, message: 'No token provided.' });

        const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
        jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            
            if (UserRole[decoded.role.toUpperCase()] > roleNeeded) {
                return res.status(403).send({ auth: false, message: 'You do not have the necessary permissions to perform this action.' });
            }
            // if everything is good, save to request for use in other routes
            req.userId = decoded.id;
            req.userRole = decoded.role;
            
            next();
        });
    }
}

const UserRole = Object.freeze({
    ADMIN: 0,
    ENGINEER: 1,
    MECHANIC: 2,
    // Add any other roles you need here
});

module.exports = {
    verifyToken,
    verifyRole,
    UserRole,
};
