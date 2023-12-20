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

const submitExercise = async (req, res) => {
	if (req.user && req.user.userId) {
		const { exercise_id, rate } = req.body;
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

				let query = `SELECT * FROM user_exercise WHERE exercise_id = ${exercise_id} AND user_id = ${user_id}`;
				let queryResult = await client.query(query);

				if (queryResult.rows.length > 0) {
					deleteImage(targetPath);
					res.status(400).json({
						error: true,
						message: "Exercise already submitted",
					});
					return;
				} else {
					query = `INSERT INTO user_exercise (exercise_id, user_id, rate, img) VALUES (${exercise_id}, ${user_id}, ${rate}, '${targetPath}') RETURNING *`;
					queryResult = await client.query(query);

					res.status(201).json({
						error: false,
						message: "Exercise submitted",
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
module.exports = { submitExercise };
