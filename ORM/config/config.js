require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;
const mysql2 = require("mysql2");

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
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
    dialectModule: mysql2,
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
    dialectModule: mysql2,
    define: {
      timestamps: false,
      underscored: true
    }
  }
}