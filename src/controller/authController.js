const { client } = require("../db");

const login = async (req, res) => {
	res.status(200).json({ message: "Login" });
};

const register = async (req, res) => {
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

const profile = async (req, res) => {
	res.status(200).json({ message: "Profile" });
};

module.exports = { login, register, profile };
