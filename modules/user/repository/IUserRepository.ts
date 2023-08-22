import { UserCreationAttributes, UserInstance, UserUpdateAttributes } from '../model/IUser';

export interface IUserRepository {
	getUsersList(): Promise<UserInstance[]>;
	getUserById(id: number): Promise<UserInstance | null>;
	getUserByDni(dni: string): Promise<UserInstance | null>;
	createUser(user: UserCreationAttributes): Promise<UserInstance>;
	updateUser(id: number, user: UserUpdateAttributes): Promise<[number]>;
	deleteUser(id: number): Promise<void>;
	loginUser(dni: string, password: string): Promise<UserInstance | null>;
	saveUser(user: UserInstance): Promise<UserInstance>;
}
