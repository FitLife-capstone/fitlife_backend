const { client } = require("../db");

const getUserDetail = async (req, res) => {
	try {
		const selectQuery = "SELECT * FROM users";
		const result = await client.query(selectQuery);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getUserExercise = async (req, res) => {
	res.status(200).json({ message: "user exercise" });
};

const getUserTask = async (req, res) => {
	res.status(200).json({ message: "user task" });
};

module.exports = { getUserDetail, getUserExercise, getUserTask };
