const { Pool } = require("pg");
require("dotenv").config();

module.exports = {
  pool: new Pool({
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    port: process.env.DB_PORT,
  }),
};
