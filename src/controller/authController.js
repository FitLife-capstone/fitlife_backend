require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { client } = require("../db");

const generateJWT = (userId, role) => {
	let secretKey;

	if (role === "admin") {
		secretKey = process.env.JWT_SECRET_ADMIN;
	} else {
		secretKey = process.env.JWT_SECRET_USER;
	}

	const token = jwt.sign({ userId: userId, role: role }, secretKey, {
		expiresIn: "1h",
	});
	return token;
};

const authMiddleware = async (req, res, next) => {
	const token = req.header("Authorization");
  
	if (!token) {
	  return res.status(401).json({ error: "Unauthorized: Token is missing" });
	}
  
	try {
	  let decoded;
	  try {
		decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_USER);
		req.user = {
		  userId: decoded.userId,
		  role: "user",
		};
	  } catch (userError) {
		decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_ADMIN);
		req.user = {
		  userId: decoded.userId,
		  role: "admin",
		};
	  }
  
	  next();
	} catch (error) {
	  console.error("Token verification error:", error);
	  res.status(401).json({ error: "Unauthorized: Invalid token" });
	}
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

		try {
			let role = "user";
			if (user.rows[0].user_id === 1) {
				role = "admin";
			}

			const token = generateJWT(user.rows[0].user_id, role);

			res.header("Authorization", `Bearer ${token}`);
			res.status(200).json({
				error: false,
				message: "success",
				loginResult: {
					userId: user.rows[0].user_id,
					name: user.rows[0].name,
					token: token,
				},
			});
		} catch (tokenError) {
			console.error("Token generation error:", tokenError);
			res.status(500).json({ error: "Internal Server Error" });
		}
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
	try {
	  const userId = req.user.userId;
  
	  const userQuery = await client.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  
	  if (userQuery.rows.length === 0) {
		return res.status(404).json({ error: "User not found" });
	  }
  
	  const userData = userQuery.rows[0];
  
	  res.status(200).json({
		error: false,
		message: "success",
		data: {
		  user_id: userData.user_id,
		  name: userData.name,
		  age: userData.age,
		  gender: userData.gender,
		  weight: userData.weight,
		  height: userData.height,
		  activity_freq: userData.activity_freq,
		  fitness_level: userData.fitness_level,
		  primary_goal: userData.primary_goal,
		  equipments: userData.equipments,
		  points: userData.points,
		},
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  

module.exports = { login, register, profile };