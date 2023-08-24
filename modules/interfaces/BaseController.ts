import { Response } from "express";

export class BaseController {
	protected catchError(res: Response, statusCode: number, error: any, message: string): Response<any> {
		console.log(error);
		return res.status(statusCode).json({
			message: message,
			error: {
				message: error.message
			},
		});
	}
}