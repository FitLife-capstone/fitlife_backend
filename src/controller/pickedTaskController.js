const { client } = require("../db");
const fs = require("fs");

function deleteImage(filePath) {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(`Error deleting image: ${err}`);
			return;
		}
		console.log("Image deleted successfully");
	});
}

const submitTask = async (req, res) => {
	const result = {};
	const { task_id, user_id, rate } = req.body;

	try {
		if (req.file) {
			const imgPath = req.file.path;
			const timestamp = new Date().getTime();
			const uniqueFilename = `${timestamp}-${req.file.originalname}`;
			const targetPath = `src/uploads/${uniqueFilename}`;
			fs.rename(imgPath, targetPath, (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ error: "Error uploading file" });
					deleteImage(imgPath);
				}
			});

			let query = `SELECT * FROM user_task WHERE task_id = ${task_id} AND user_id = ${user_id}`;
			let queryResult = await client.query(query);

			if (queryResult.rows.length > 0) {
				result["error"] = true;
				result["message"] = "Task already submitted";
				deleteImage(targetPath);
				res.status(400).json(result);
				return;
			} else {
				query = `INSERT INTO user_task (task_id, user_id, rate, img) VALUES (${task_id}, ${user_id}, ${rate}, '${targetPath}') RETURNING *`;
				queryResult = await client.query(query);

				result["error"] = false;
				result["message"] = "Task submitted";
				result["data"] = queryResult.rows[0];

				res.status(201).json(result);
			}
		} else {
			result["error"] = true;
			result["message"] = "Missing required fields";

			res.status(400).json(result);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
module.exports = { submitTask };
