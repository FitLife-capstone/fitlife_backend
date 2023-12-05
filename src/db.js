const { Client } = require("pg");

const client = new Client({
	host: "fitlife-db",
	user: "postgres",
	database: "fitlife_db",
	password: "123456",
});

client.connect();

module.exports = { client };
