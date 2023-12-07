require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { client } = require("../db");

const generateJWT = (userId) => {
	const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
	return token;
};

const login = async (req, res) => {
	const { email, pass } = req.body;

	try {
		const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);

		if (!user.rows.length) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const passwordMatch = await bcrypt.compare(pass, user.rows[0].pass);

		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = generateJWT(user.rows[0].id);

		res.header("Authorization", `Bearer ${token}`);
		res.status(200).json({
			error: false,
			message: "success",
			loginResult: {
				userId: user.rows[0].id,
				name: user.rows[0].name,
				token: token,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const register = async (req, res) => {
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
		equipments,
	} = req.body;

	try {
		// Validation checks
		if (!name || !email || !pass || !age || !gender || !weight || !height || !activity_freq || !fitness_level || !primary_goal || !equipments) {
			return res.status(400).json({ error: "Please provide all required fields" });
		}

		if (activity_freq > 7) {
			return res.status(400).json({ error: "Activity frequency cannot exceed 7" });
		}

		const hashedPassword = await bcrypt.hash(pass, 10);

		const insertQuery =
			"INSERT INTO users (name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

		const values = [
			name,
			email,
			hashedPassword,
			age,
			gender,
			weight,
			height,
			activity_freq,
			fitness_level,
			primary_goal,
			equipments,
		];

		const result = await client.query(insertQuery, values);

		res.status(201).json({
			error: false,
			message: "User Created",
			user: result.rows[0],
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const profile = async (req, res) => {
	res.status(200).json({ message: "Profile" });
};

module.exports = { login, register, profile };