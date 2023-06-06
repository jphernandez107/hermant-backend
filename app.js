const express = require('express')
const cors = require('cors')
const verifyToken = require("./middleware/jwtMiddleware").verifyToken
const app = express()
const port = process.env.PORT || 8080

const routes = require('./routes/routes')
const allowedOrigins = ['http://localhost:3000', 'https://master.d9oqcgcqxj3zw.amplifyapp.com/', 'https://dev.d9oqcgcqxj3zw.amplifyapp.com/'];

app.use(express.json())

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin. jeje';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(verifyToken)

routes.routesMap.forEach((route) => {
	app.use(route.url, route.model)
})

app.listen(port, () => {
	console.log('Server running on port ' + port + '.')
})
