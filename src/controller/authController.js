const { client } = require("../db");

const login = async (req, res) => {
	res.status(200).json({ message: "Login" });
};

const createUser = async (req, res) => {
	const {
		name,
		email,
		pass,
		age,
		gender,
		weight,
		height,
		activity_freq,
		fitness_level,
		primary_goal,
		equipment,
	} = req.body;

	try {
		const insertQuery =
			"INSERT INTO users (name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

		const values = [
			name,
			email,
			pass,
			age,
			gender,
			weight,
			height,
			activity_freq,
			fitness_level,
			primary_goal,
			equipment,
		];

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

module.exports = { login, createUser, profile };
