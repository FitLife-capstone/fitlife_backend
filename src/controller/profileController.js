const { ErrorInternalServer, ErrorUnauthorized } = require("../common/commonResponse");
const { client } = require("../db");

const getUserDetail = async (req, res) => {
	if (req.user && req.user.userId) {
		const userId = req.user.userId;
		try {
			const selectQuery = `SELECT email, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipments, points FROM users WHERE user_id = ${userId}`;
			const result = await client.query(selectQuery);
			res.status(200).json(result.rows[0]);
		} catch (error) {
			console.error(error);
			res.status(500).json(ErrorInternalServer);
		}
	} else {
		res.status(401).json(ErrorUnauthorized);
	}
};

const getUserExercise = async (req, res) => {
	if (req.user && req.user.userId) {
		const userId = req.user.userId;
		try {
			const selectQuery = `SELECT * FROM user_exercise WHERE user_id = ${userId}`;
			const result = await client.query(selectQuery);
			res.status(200).json(result.rows);
		} catch (error) {
			console.error(error);
			res.status(500).json(ErrorInternalServer);
		}
	} else {
		res.status(401).json(ErrorUnauthorized);
	}
};

const getUserTask = async (req, res) => {
	if (req.user && req.user.userId) {
		const userId = req.user.userId;
		try {
			const selectQuery = `SELECT * FROM user_task WHERE user_id = ${userId}`;
			const result = await client.query(selectQuery);
			res.status(200).json(result.rows);
		} catch (error) {
			console.error(error);
			res.status(500).json(ErrorInternalServer);
		}
	} else {
		res.status(401).json(ErrorUnauthorized);
	}
};

module.exports = { getUserDetail, getUserExercise, getUserTask };
