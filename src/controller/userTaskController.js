const { client } = require("../db");

const getAllUserTask = async (req, res) => {
	try {
		const query =
			"SELECT * FROM user_task WHERE status = 'PENDING' ORDER BY created_date ASC";

		const queryResult = await client.query(query);
		if (queryResult.rows.length == 0) {
			res.status(201).json({
				error: false,
				message: "No pending task",
			});
			return;
		}

		res.status(201).json({
			error: false,
			message: "Success",
			data: queryResult.rows,
		});
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const acceptUserTask = async (req, res) => {
	res.status(200).json({ message: "acceptUserTask" });
};

const rejectUserTask = async (req, res) => {
	res.status(200).json({ message: "rejectUserTask" });
};

module.exports = { getAllUserTask, acceptUserTask, rejectUserTask };
