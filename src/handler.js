const { Client } = require("pg");

const client = new Client({
	host: "fitlife-db",
	user: "postgres",
	database: "fitlife_db",
	password: "123456",
});

client.connect();

const getUsers = async (req, res) => {
	try {
		const selectQuery = "SELECT * FROM users";
		const result = await client.query(selectQuery);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createUser = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const insertQuery =
			"INSERT INTO users (name, email, pass) VALUES ($1, $2, $3) RETURNING *";
		const values = [name, email, password];
		const result = await client.query(insertQuery, values);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { getUsers, createUser };
