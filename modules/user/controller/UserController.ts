import { Request, Response } from 'express';
import { IUserController } from './IUserController';
import { IUserService, UserMessages } from '../service/IUserService';
import { UserCreationAttributes, UserInstance } from '../model/IUser';
import { BaseController } from '../../interfaces/BaseController';
import { autoInjectable, container, inject } from 'tsyringe';
import { UserService } from '../service/UserService';
import i18n from 'i18n';

@autoInjectable()
export class UserController extends BaseController implements IUserController {

	constructor(
		@inject(UserService) private service: IUserService
	) {
		super();
	}

	public getUsersList = async (req: Request, res: Response): Promise<Response<UserInstance[]>> => {
		try {
			const users = await this.service.getUsersList();
			if (!users) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			return res.status(200).json(users);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(UserMessages.USER_NOT_FOUND));
		}
	}

	public getUserById = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const user = await this.service.getUserById(Number(req.query.id));
			if (!user) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			return res.status(200).json(user);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(UserMessages.USER_NOT_FOUND));
		}
	}

	public createUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const user = await this.service.createUser(this.parseUserCreationAttributesFromBody(req));
			if (!user) throw new Error(i18n.__(UserMessages.ERROR_CREATING_USER));
			return res.status(200).json({
				message: i18n.__(UserMessages.USER_CREATED),
				user: user
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(UserMessages.ERROR_CREATING_USER));
		}
	}

	public updateUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const [updated] = await this.service.updateUser(Number(req.params.id), this.parseUserCreationAttributesFromBody(req, false));
			if (updated[0].length === 0) throw new Error(i18n.__(UserMessages.ERROR_UPDATING_USER));
			return res.status(200).json({ 
				message: i18n.__(UserMessages.USER_UPDATED),
				user: updated[1] 
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(UserMessages.ERROR_UPDATING_USER));
		}
	}

	public deleteUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const user = await this.service.getUserById(Number(req.params.id));
			if (!user) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			await this.service.deleteUser(user.id);
			return res.status(200).json({ 
				message: i18n.__(UserMessages.USER_DELETED),
				user: user,
				deleted: true 
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(UserMessages.ERROR_DELETING_USER));
		}
	}

	public loginUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const result = await this.service.loginUser(req.body.dni, req.body.password);
			if (!result) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			return res.status(200).json({
				token: result[0],
				user: result[1]
			});
		} catch (error) {
			return this.catchError(res, 400, error, i18n.__(UserMessages.AUTHENTICATION_FAILED));
		}
	}

	public activateUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const user = await this.service.activateUser(Number(req.params.id));
			if (!user || user[0] === 0) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			return res.status(200).json({ 
				message: i18n.__(UserMessages.USER_ACTIVATED),
				user: user
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(UserMessages.ERROR_ACTIVATING_USER));
		}
	}

	public deactivateUser = async (req: Request, res: Response): Promise<Response<UserInstance>> => {
		try {
			const user = await this.service.deactivateUser(Number(req.params.id));
			if (!user || user[0] === 0) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
			return res.status(200).json({ 
				message: i18n.__(UserMessages.USER_DEACTIVATED),
				user: user
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(UserMessages.ERROR_DEACTIVATING_USER));
		}
	}

	private parseUserCreationAttributesFromBody(req: Request, isCreating: boolean = true): UserCreationAttributes {
		const {
			dni,
			password,
			first_name,
			last_name,
			role
		} = req.body;
	
		// Check for required fields
		if (isCreating && (!dni || !password || !first_name || !last_name || !role)) {
			throw Error('Missing required attributes');
		}
	
		const userAttributes: UserCreationAttributes = {
			dni: dni as string,
			password: password as string,
			first_name: first_name as string,
			last_name: last_name as string,
			role:role,
			active: true
		};
	
		return userAttributes;
	}

}
