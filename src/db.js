require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});

client.connect();

module.exports = { client };
