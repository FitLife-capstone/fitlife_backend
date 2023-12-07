const { client } = require("../db");

const getAllTask = async (req, res) => {
	const result = {};

	try {
		const query = "SELECT * FROM task ORDER BY created_date DESC";

		const queryResult = await client.query(query);

		result["error"] = false;
		result["message"] = "Success";
		result["data"] = queryResult.rows;

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getTask = async (req, res) => {
	const task_id = req.params.id;
	const result = {};

	try {
		const query = `SELECT * FROM task WHERE task_id = ${task_id}`;

		const queryResult = await client.query(query);

		if (queryResult.rows.length == 0) {
			result["error"] = true;
			result["message"] = "Task not found";
			res.status(400).json(result);
			return;
		}

		result["error"] = false;
		result["message"] = "Success";
		result["data"] = queryResult.rows[0];

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createTask = async (req, res) => {
	res.status(200).json({ message: "create task" });
};

module.exports = { getAllTask, getTask, createTask };
