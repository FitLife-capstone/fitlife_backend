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

function deleteImage(gcsFilePath) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(gcsFilePath);

  file.delete().then(() => {
    console.log(`Image deleted successfully from Google Cloud Storage: ${gcsFilePath}`);
  }).catch((err) => {
    console.error(`Error deleting image from Google Cloud Storage: ${err}`);
  });
}

const submitTask = async (req, res) => {
  if (req.user && req.user.userId) {
    const { task_id, rate } = req.body;
    const user_id = req.user.userId;

    try {
      if (req.file) {
        const imgPath = req.file.path;
        const timestamp = new Date().getTime();
        const uniqueFilename = `${timestamp}-${req.file.originalname}`;
        const targetPath = `src/uploads/task/${uniqueFilename}`;

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(targetPath);

        await file.save(fs.createReadStream(imgPath), {
          metadata: { contentType: req.file.mimetype },
        });

        deleteImage(imgPath);

        let query = `SELECT * FROM user_task WHERE task_id = ${task_id} AND user_id = ${user_id}`;
        let queryResult = await client.query(query);

        if (queryResult.rows.length > 0) {
          res.status(400).json({
            error: true,
            message: 'Task already submitted',
          });
          return;
        } else {
          query = `INSERT INTO user_task (task_id, user_id, rate, img, status) VALUES (${task_id}, ${user_id}, ${rate}, '${file.publicUrl()}', 'PENDING') RETURNING *`;
          queryResult = await client.query(query);

          res.status(201).json({
            error: false,
            message: 'Task submitted',
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

module.exports = { submitTask };
