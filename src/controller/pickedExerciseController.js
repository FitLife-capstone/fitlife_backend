require("dotenv").config();

const { client } = require("../db");
const { Storage } = require("@google-cloud/storage");
const {
  ErrorUploadingFile,
  ErrorInternalServer,
  ErrorUnauthorized,
} = require("../common/commonResponse");
const fs = require("fs");

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.CLOUDSTORAGE_CRED,
});

const bucketName = process.env.BUCKETNAME;

const submitExercise = async (req, res) => {
  if (req.user && req.user.userId) {
    const { exercise_id, rate } = req.body;
    const user_id = req.user.userId;

    try {
      if (req.file) {
        const imgPath = req.file.path;
        const timestamp = new Date().getTime();
        const uniqueFilename = `${timestamp}-${req.file.originalname}`;
        const targetPath = `src/uploads/exercise/${uniqueFilename}`;

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(targetPath);

        await file.save(fs.createReadStream(imgPath), {
          metadata: { contentType: req.file.mimetype },
        });

        let query = `SELECT * FROM user_exercise WHERE exercise_id = ${exercise_id} AND user_id = ${user_id}`;
        let queryResult = await client.query(query);

        if (queryResult.rows.length > 0) {
          res.status(400).json({
            error: true,
            message: 'Exercise already submitted',
          });
          return;
        } else {
          query = `INSERT INTO user_exercise (exercise_id, user_id, rate, img) VALUES (${exercise_id}, ${user_id}, ${rate}, '${file.publicUrl()}') RETURNING *`;
          queryResult = await client.query(query);

          res.status(201).json({
            error: false,
            message: 'Exercise submitted',
            data: queryResult.rows[0],
          });
        }
      } else {
        res.status(400).json({
          error: true,
          message: 'Missing required fields',
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
