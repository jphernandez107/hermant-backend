import * as jwt from 'jsonwebtoken';
import { VerifyErrors, TokenExpiredError, NotBeforeError, JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import i18n from 'i18n';

interface DecodedToken {
	id: string; 
	role: string;
}

const MiddlewareMessages = {
	NO_TOKEN_PROVIDED: "NO_TOKEN_PROVIDED",
	FAILED_TO_AUTHENTICATE_TOKEN: "FAILED_TO_AUTHENTICATE_TOKEN",
	NECESSARY_PERMISSIONS_MISSING: "NECESSARY_PERMISSIONS_MISSING",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	TOKEN_NOT_ACTIVE_YET: "TOKEN_NOT_ACTIVE_YET",
	INVALID_USER_ROLE: "INVALID_USER_ROLE",
}

function verifyToken(req: Request, res: Response, next: NextFunction): RequestHandler {
	const excludedPaths = ['/user/signin', '/user/register', '/'];
	if (excludedPaths.includes(req.path)) {
		next();
		return;
	}

	const authHeader = req.header('Authorization');
	if (!authHeader){
		res.status(401).send({ 
			auth: false, 
			message: i18n.__(MiddlewareMessages.NO_TOKEN_PROVIDED)
		});
		return;
	} 

	try {
		const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
		jwt.verify(token, process.env.TOKEN_SECRET!);
		next();
	} catch (error) {
		switch (error.constructor) {
			case JsonWebTokenError:
				console.error('Access Denied. Invalid Token');
				res.status(401).json({
					error: error.message,
					message: i18n.__(MiddlewareMessages.FAILED_TO_AUTHENTICATE_TOKEN)
				});
				break;
			case TokenExpiredError:
				console.error('Token has expired');
				res.status(401).json({
					error: error.message,
					message: i18n.__(MiddlewareMessages.TOKEN_EXPIRED)
				});
				break;
			case NotBeforeError:
				console.error('Token not active yet');
				res.status(401).json({
					error: error.message,
					message: i18n.__(MiddlewareMessages.TOKEN_NOT_ACTIVE_YET)
				});
				break;
			default:
				console.error('Unknown JWT error');
				res.status(500).json({
					error: error.message,
					message: i18n.__(MiddlewareMessages.FAILED_TO_AUTHENTICATE_TOKEN)
				});
		}		
	}
};

function verifyRole(roleNeeded: UserRole): RequestHandler {
	return function (req: Request, res: Response, next: NextFunction): any {
		const authHeader = req.header('Authorization');
		if (!authHeader) return res.status(401).send({ auth: false, message: i18n.__(MiddlewareMessages.NO_TOKEN_PROVIDED) });

		const token = authHeader.split(' ')[1]; // Take the token part after 'Bearer'
		jwt.verify(token, process.env.TOKEN_SECRET!, function(err: VerifyErrors | null, decoded: DecodedToken | undefined) {
			if (err) {
				if (err instanceof TokenExpiredError) {
					return res.status(401).send({ auth: false, message: i18n.__(MiddlewareMessages.TOKEN_EXPIRED) });
				} else if (err instanceof NotBeforeError) {
					return res.status(401).send({ auth: false, message: i18n.__(MiddlewareMessages.TOKEN_NOT_ACTIVE_YET) });
				} else {
					return res.status(500).send({ auth: false, message: i18n.__(MiddlewareMessages.FAILED_TO_AUTHENTICATE_TOKEN) });
				}
			}

			if (!decoded || !(decoded.role.toUpperCase() in UserRole)) {
				return res.status(403).send({ auth: false, message: i18n.__(MiddlewareMessages.INVALID_USER_ROLE) });
			}

			const userRoleValue: number = UserRole[decoded.role.toUpperCase() as keyof typeof UserRole];
			if (userRoleValue > roleNeeded) {
				return res.status(403).send({ auth: false, message: i18n.__(MiddlewareMessages.NECESSARY_PERMISSIONS_MISSING) });
			}
			console.log("🚀 ~ file: jwtMiddleware.ts:61 ~ jwt.verify ~ Permissions granted.")
			next();
		});
	}
}


enum UserRole {
	ADMIN = 0,
	ENGINEER = 1,
	MECHANIC = 2,
	// Add any other roles you need here
}

export {
	verifyToken,
	verifyRole,
	UserRole,
};
