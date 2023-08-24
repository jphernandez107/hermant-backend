import { UserCreationAttributes, UserInstance } from '../model/IUser';

export interface IUserService {
	getUsersList(): Promise<UserInstance[]>;
	getUserById(id: number): Promise<UserInstance | null>;
	createUser(user: UserCreationAttributes): Promise<UserInstance>;
	updateUser(id: number, userAttributes: UserCreationAttributes): Promise<[number, UserInstance]>;
	deleteUser(id: number): Promise<void>;
	loginUser(dni: string, password: string): Promise<[string, UserInstance | null]>;
	activateUser(id: number): Promise<[number, UserInstance]>;
	deactivateUser(id: number): Promise<[number, UserInstance]>;
}

export const UserMessages = {
	USER_NOT_FOUND: "USER_NOT_FOUND",
	ERROR_CREATING_USER: "ERROR_CREATING_USER",
	USER_CREATED: "USER_CREATED",
	ERROR_UPDATING_USER: "ERROR_UPDATING_USER",
	USER_UPDATED: "USER_UPDATED",
	ERROR_DELETING_USER: "ERROR_DELETING_USER",
	USER_DELETED: "USER_DELETED",
	AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
	INCORRECT_PASSWORD: "INCORRECT_PASSWORD",
	ERROR_ACTIVATING_USER: "ERROR_ACTIVATING_USER",
	USER_ACTIVATED: "USER_ACTIVATED",
	ERROR_DEACTIVATING_USER: "ERROR_DEACTIVATING_USER",
	USER_DEACTIVATED: "USER_DEACTIVATED",
}
