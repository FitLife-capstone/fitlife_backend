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
		res.status(500).json(ErrorInternalServer);
	}
};

const acceptUserTask = async (req, res) => {
	if (req.user.role !== "admin") {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
	const userID = req.params.userId;
	const taskID = req.params.taskId;

	try {
		const query = `UPDATE user_task SET status = 'APPROVED' WHERE user_id = ${userID} AND task_id = ${taskID} RETURNING *`;
		const queryResult = await client.query(query);
		const query2 = `UPDATE users SET points = points + (SELECT points FROM task WHERE task_id =  ${taskID}) WHERE user_id = ${userID}`;
		await client.query(query2);

		if (queryResult.rowCount == 0) {
			res.status(400).json({
				error: true,
				message: "User task not found",
			});
			return;
		}
		res.status(201).json({
			error: false,
			message: "Task Approved",
		});
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const rejectUserTask = async (req, res) => {
	if (req.user.role !== "admin") {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
	const userID = req.params.userId;
	const taskID = req.params.taskId;

	try {
		const query = `UPDATE user_task SET status = 'REJECTED' WHERE user_id = ${userID} AND task_id = ${taskID} RETURNING *`;
		const queryResult = await client.query(query);

		if (queryResult.rowCount == 0) {
			res.status(400).json({
				error: true,
				message: "User task not found",
			});
			return;
		}
		res.status(201).json({
			error: false,
			message: "Task rejected",
		});
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { getAllUserTask, acceptUserTask, rejectUserTask };
