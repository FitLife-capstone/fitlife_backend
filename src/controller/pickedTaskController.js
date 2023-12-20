const { client } = require("../db");
const fs = require("fs");
const { ErrorUploadingFile, ErrorInternalServer, ErrorUnauthorized } = require("../common/commonResponse");

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
	if (req.user && req.user.userId) {
		const result = {};
		const { task_id, rate } = req.body;
		const user_id = req.user.userId;
		try {
			if (req.file) {
				const imgPath = req.file.path;
				const timestamp = new Date().getTime();
				const uniqueFilename = `${timestamp}-${req.file.originalname}`;
				const targetPath = `src/uploads/${uniqueFilename}`;
				fs.rename(imgPath, targetPath, (err) => {
					if (err) {
						deleteImage(imgPath);
						console.log(err);
						return res.status(500).json(ErrorUploadingFile);
					}
				});

				let query = `SELECT * FROM user_task WHERE task_id = ${task_id} AND user_id = ${user_id}`;
				let queryResult = await client.query(query);

				if (queryResult.rows.length > 0) {
					deleteImage(targetPath);
					res.status(400).json({
						error: true,
						message: "Task already submitted",
					});
					return;
				} else {
					query = `INSERT INTO user_task (task_id, user_id, rate, img, status) VALUES (${task_id}, ${user_id}, ${rate}, '${targetPath}', 'PENDING') RETURNING *`;
					queryResult = await client.query(query);

					res.status(201).json({
						error: false,
						message: "Task submitted",
						data: queryResult.rows[0],
					});
				}
			} else {
				res.status(400).json({
					error: true,
					message: "Missing required fields",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json(ErrorInternalServer);
		}
	} else {
		res.status(401).json(ErrorUnauthorized);
	}
};
module.exports = { submitTask };
