require("dotenv").config();

const { client } = require("../db");
const { Storage } = require("@google-cloud/storage");
const {
  ErrorUploadingFile,
  ErrorInternalServer,
  ErrorUnauthorized,
} = require("../common/commonResponse");
const path = require("path");

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.CLOUDSTORAGE_CRED,
});

const bucketName = process.env.BUCKETNAME;

const submitTask = async (req, res) => {
  if (req.user && req.user.userId) {
    const { task_id, rate } = req.body;
    const user_id = req.user.userId;

    try {
      let query = `SELECT * FROM user_task WHERE task_id = ${task_id} AND user_id = ${user_id}`;
      let queryResult = await client.query(query);

      if (queryResult.rows.length > 0) {
        res.status(400).json({
          error: true,
          message: "Task already submitted",
        });
        return;
      }

      if (req.file) {
        const timestamp = new Date().getTime();
        const uniqueFilename = `${timestamp}-${req.file.originalname}`;
        const file = storage
          .bucket(bucketName)
          .file(`src/uploads/task/${uniqueFilename}`);

        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.error(`Error uploading to Cloud Storage: ${err}`);
          return res.status(500).json(ErrorUploadingFile);
        });

        stream.on("finish", async () => {
          const imgURL = `https://storage.googleapis.com/${bucketName}/src/uploads/task/${uniqueFilename}`;

          query = `INSERT INTO user_task (task_id, user_id, rate, img, status) VALUES (${task_id}, ${user_id}, ${rate}, '${imgURL}', 'PENDING') RETURNING *`;
          queryResult = await client.query(query);

          console.log(`Image uploaded successfully: ${imgURL}`);

          res.status(201).json({
            error: false,
            message: "Task submitted",
            data: queryResult.rows[0],
          });
        });

        stream.end(req.file.buffer);
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
