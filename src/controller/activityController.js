const { client } = require("../db");

const getAllActivity = async (req, res) => {
	const result = {};

	try {
		const query = "SELECT * FROM exercise";

		const queryResult = await client.query(query);

		result["error"] = false;
		result["message"] = "Success";
		result["data"] = queryResult.rows;

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getActivity = async (req, res) => {
	const exercise_id = req.params.id;
	const result = {};

	try {
		const query = `SELECT * FROM exercise WHERE exercise_id = ${exercise_id}`;

		const queryResult = await client.query(query);

		result["error"] = false;
		result["message"] = "Success";
		result["data"] = queryResult.rows[0];

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { getAllActivity, getActivity };
