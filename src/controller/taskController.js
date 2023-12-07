const { client } = require("../db");

const getAllTask = async (req, res) => {
	const result = {};

	try {
		const query = "SELECT * FROM task ORDER BY created_date DESC";

		const queryResult = await client.query(query);

		if (queryResult.rows.length == 0) {
			result["error"] = true;
			result["message"] = "No active challenge";
			res.status(400).json(result);
			return;
		}

		result["error"] = false;
		result["message"] = "Success";
		result["data"] = queryResult.rows;

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllActiveTask = async (req, res) => {
	const result = {};

	try {
		const query =
			"SELECT * FROM task WHERE end_date >= CURRENT_DATE  ORDER BY created_date DESC";

		const queryResult = await client.query(query);

		if (queryResult.rows.length == 0) {
			result["error"] = true;
			result["message"] = "No active challenge";
			res.status(400).json(result);
			return;
		}

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
	const result = {};
	const token = req?.headers["authorization"];

	const { category, task_name, task_desc, start_at, end_at } = req.body;

	if (!category || !task_name || !task_desc || !start_at || !end_at) {
		result["error"] = true;
		result["message"] = "Missing required fields";
		res.status(400).json(result);
		return;
	} else if (start_at > end_at) {
		result["error"] = true;
		result["message"] = "Start date must be before end date";
		res.status(400).json(result);
		return;
	} else {
		try {
			const insertQuery =
				"INSERT INTO task (category, task_name, task_desc, created_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *";

			const values = [category, task_name, task_desc, start_at, end_at];

			const resultQuery = await client.query(insertQuery, values);

			result["error"] = false;
			result["message"] = "Task created";
			result["data"] = resultQuery.rows[0];
			res.status(201).json(result);
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
};

module.exports = { getAllTask, getTask, createTask, getAllActiveTask };
