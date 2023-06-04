require('dotenv').config();
// const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_HOST = 'hermant-dev.c78o0dss7yre.us-east-2.rds.amazonaws.com'
const DB_USERNAME = 'yoojuaan'
const DB_PASSWORD = '123456jp'
const DB_DATABASE = 'hermantdev'
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
    database: `${DB_DATABASE}-tests`,
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