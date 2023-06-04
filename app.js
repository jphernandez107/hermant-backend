const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const routes = require('./routes/routes')

app.use(express.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

routes.routesMap.forEach((route) => {
	app.use(route.url, route.model)
})

app.listen(port, () => {
	console.log('Server running on port ' + port + '.')
})
