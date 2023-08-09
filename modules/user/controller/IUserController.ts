import { Request, Response } from 'express';
import { UserInstance } from '../model/IUser';

export interface IUserController {
	getUsersList(req: Request, res: Response): Promise<Response<UserInstance[]>>;
	getUserById(req: Request, res: Response): Promise<Response<UserInstance>>;
	createUser(req: Request, res: Response): Promise<Response<UserInstance>>;
	updateUser(req: Request, res: Response): Promise<Response<UserInstance>>;
	deleteUser(req: Request, res: Response): Promise<Response<UserInstance>>;
	loginUser(req: Request, res: Response): Promise<Response<UserInstance>>;
	activateUser(req: Request, res: Response): Promise<Response<UserInstance>>;
	deactivateUser(req: Request, res: Response): Promise<Response<UserInstance>>;
}
