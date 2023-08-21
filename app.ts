import 'reflect-metadata';
import { container } from 'tsyringe';
import express from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/jwtMiddleware';
import i18n from './middleware/i18n';
import { routes } from './routes/routes';
import { models } from './ORM/index';
console.log(" ~ file: app.ts:9 ~ models:", models)

const app: express.Application = express();
const port = process.env.PORT || 8080;

const allowedOrigins = ['http://localhost:3000', 'https://master.d9oqcgcqxj3zw.amplifyapp.com', 'https://dev.d9oqcgcqxj3zw.amplifyapp.com', '*'];

app.use(express.json());

app.use(cors({
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	credentials: true,
}));
app.use(verifyToken);

app.use(i18n.init);
app.use((req, res, next) => {
	const locale = req.acceptsLanguages('es', 'en');
	if (typeof locale === 'string' && i18n.getLocales().includes(locale)) {
		i18n.setLocale(locale);
	} else {
		i18n.setLocale('es');
	}
	next();
});

routes().forEach((route) => {
	app.use(route.url, route.router);
});

app.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
