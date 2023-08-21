import { Model, Optional } from 'sequelize';

export interface UserAttributes {
	id: number;
	dni: string;
	password: string;
	password_salt: string;
	first_name: string;
	last_name: string;
	role: 'Admin' | 'Engineer' | 'Mechanic' | 'Warehouse Manager';
	created_at: Date;
	updated_at: Date;
	last_login?: Date | null;
	password_reset_token?: string | null;
	password_reset_token_expiry?: Date | null;
	active: boolean | true;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'last_login' | 'password_reset_token' | 'password_reset_token_expiry' | 'password_salt' | 'updated_at' | 'created_at'> {}
export interface UserUpdateAttributes extends Optional<UserCreationAttributes, 'dni' | 'first_name'| 'last_name' | 'password' | 'role'> {}
export type UserInstance = UserAttributes & Model<UserAttributes, UserCreationAttributes>;
