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
    const { exercise_id } = req.body;
    const user_id = req.user.userId;

    try {
      if (exercise_id) {
          query = `INSERT INTO user_exercise (exercise_id, user_id) VALUES (${exercise_id}, ${user_id})`;
          queryResult = await client.query(query);

          res.status(201).json({
            error: false,
            message: 'Exercise submitted',
        })
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
