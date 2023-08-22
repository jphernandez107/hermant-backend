import { singleton, inject, injectable } from 'tsyringe';
import { IUserService, UserMessages } from '../service/IUserService';
import { UserCreationAttributes, UserInstance } from '../model/IUser';
import { IUserRepository } from '../repository/IUserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/UserRepository';
import i18n from 'i18n';

@singleton()
@injectable()
export class UserService implements IUserService {
	SALT_ROUNDS = 10;  // for bcrypt

	constructor(
		@inject(UserRepository) private userRepository: IUserRepository
	){}

	public async getUsersList(): Promise<UserInstance[]> {
		return await this.userRepository.getUsersList();
	}

	public async getUserById(id: number): Promise<UserInstance | null> {
		return await this.userRepository.getUserById(id);
	}

	public async createUser(user: UserCreationAttributes): Promise<UserInstance> {
		const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
		user.password = await bcrypt.hash(user.password, salt);
		user.password_salt = salt;
		return await this.userRepository.createUser(user);
	}

	public async updateUser(id: number, userAttributes: UserCreationAttributes): Promise<[number, UserInstance]> {
		const user = await this.getUserById(id);
		if (!user) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
		const count = await this.userRepository.updateUser(user.id, userAttributes)
		return [count[0], user];
	}

	public async deleteUser(id: number): Promise<void> {
		await this.userRepository.deleteUser(id);
	}

	public async loginUser(dni: string, password: string): Promise<[string, UserInstance | null]> {
		const user = await this.userRepository.getUserByDni(dni);
		if (!user) throw new Error(i18n.__(UserMessages.INCORRECT_PASSWORD));
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) throw new Error(i18n.__(UserMessages.INCORRECT_PASSWORD));

		user.last_login = new Date();
		await this.userRepository.saveUser(user)

		const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '8h' });
		delete user.password;
		delete user.dataValues.password_salt
		delete user.dataValues.password_reset_token
		delete user.dataValues.password_reset_token_expiry
		delete user.dataValues.updated_at
		delete user.dataValues.created_at
		delete user.dataValues.active
		return [token, user];
	}

	public async activateUser(id: number): Promise<[number, UserInstance]> {
		const user = await this.userRepository.getUserById(id);
		if (!user) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
		const count = await this.userRepository.updateUser(id, { active: true });
		return [count[0], user];
	}

	public async deactivateUser(id: number): Promise<[number, UserInstance]> {
		const user = await this.userRepository.getUserById(id);
		if (!user) throw new Error(i18n.__(UserMessages.USER_NOT_FOUND));
		const count = await this.userRepository.updateUser(id, { active: false });
		return [count[0], user];
	}
}
