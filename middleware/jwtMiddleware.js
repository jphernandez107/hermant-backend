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

      
      try {
        const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(decoded.role !== roleNeeded) return res.status(403).send('You do not have the necessary permissions to perform this action.');
        if (UserRole[decoded.role.toUpperCase()] > UserRole[roleNeeded]) {
            return res.status(403).send({ auth: false, message: 'You do not have the necessary permissions to perform this action.' });
        }
        
        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        req.userRole = decoded.role;
        
        next();
      } catch (error) {
        console.error('Failed to authenticate token.');
        res.status(500).send({error, message:'Failed to authenticate token.'});
      } 
    }
  }

module.exports = {
    verifyToken,
    verifyRole
};
