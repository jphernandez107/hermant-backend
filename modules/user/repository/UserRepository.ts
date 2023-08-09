// UserRepository.ts
import { User } from '../model/User';
import { UserInstance, UserCreationAttributes, UserUpdateAttributes } from '../model/IUser';
import { IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
	public async getUsersList(): Promise<UserInstance[]> {
		return await User.findAll();
	}

	public async getUserById(id: number): Promise<UserInstance | null> {
		return await User.findByPk(id);
	}

	public async getUserByDni(dni: string): Promise<UserInstance | null> {
		return await User.findOne({ where: { dni } });
	}

	public async createUser(user: UserCreationAttributes): Promise<UserInstance> {
		return await User.create(user);
	}

	public async updateUser(id: number, user: UserUpdateAttributes): Promise<[number, UserInstance[]]> {
		return await User.update(user, { where: { id }, returning: true });
	}

	public async deleteUser(id: number): Promise<void> {
		const user = await User.findByPk(id);
		if (user) {
		await user.destroy();
		}
	}

	public async loginUser(dni: string, password: string): Promise<UserInstance | null> {
		return await User.findOne({ where: { dni, password } });
	}

	public async saveUser(user: UserInstance): Promise<UserInstance> {
		return await user.save();
	}
}
  
