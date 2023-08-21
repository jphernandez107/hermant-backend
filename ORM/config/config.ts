import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config();

const { DB_HOST_DEV, DB_USERNAME_DEV, DB_PASSWORD_DEV, DB_DATABASE_DEV, DB_PORT_DEV } = process.env;
const { DB_HOST_TEST, DB_USERNAME_TEST, DB_PASSWORD_TEST, DB_DATABASE_TEST, DB_PORT_TEST } = process.env;
const { DB_HOST_PROD, DB_USERNAME_PROD, DB_PASSWORD_PROD, DB_DATABASE_PROD, DB_PORT_PROD } = process.env;

interface DatabaseConfig {
  username: string | undefined;
  password: string | undefined;
  database: string;
  host: string | undefined;
  dialect: string;
  dialectModule: typeof mysql2;
  port: string | undefined;
  define: {
    timestamps: boolean;
    underscored: boolean;
  };
}

const development: DatabaseConfig = {
  username: DB_USERNAME_DEV,
  password: DB_PASSWORD_DEV,
  database: DB_DATABASE_DEV,
  host: DB_HOST_DEV,
  port: DB_PORT_DEV,
  dialect: "mysql",
  dialectModule: mysql2,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const test: DatabaseConfig = {
  username: DB_USERNAME_TEST,
  password: DB_PASSWORD_TEST,
  database: DB_DATABASE_TEST,
  port: DB_PORT_TEST,
  host: DB_HOST_TEST,
  dialect: "mysql",
  dialectModule: mysql2,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const production: DatabaseConfig = {
  username: DB_USERNAME_PROD,
  password: DB_PASSWORD_PROD,
  database: DB_DATABASE_PROD,
  port: DB_PORT_PROD,
  host: DB_HOST_PROD,
  dialect: "mysql",
  dialectModule: mysql2,
  define: {
    timestamps: false,
    underscored: true,
  },
};

export default {
  development,
  test,
  production,
};
