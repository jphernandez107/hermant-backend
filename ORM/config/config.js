require('dotenv').config();
// const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_HOST = '127.0.0.1'
const DB_USERNAME = 'root'
const DB_PASSWORD = '123456jp'
const DB_DATABASE = 'hermant'
const DB_PORT = 3306

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "mysql",
    port: DB_PORT,
    define: {
      timestamps: false,
      underscored: true
    }
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    host: DB_HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
      underscored: true
    }
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    host: DB_HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
      underscored: true
    }
  }
}