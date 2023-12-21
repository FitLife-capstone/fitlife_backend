const {
  ErrorInternalServer,
  ErrorUnauthorized,
} = require("../common/commonResponse");
const { client } = require("../db");

const getUserDetail = async (req, res) => {
  if (req.user && req.user.userId) {
    const userId = req.user.userId;
    try {
      const selectQuery = `SELECT email, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipments, points FROM users WHERE user_id = ${userId}`;
      const result = await client.query(selectQuery);
      res.status(200).json({items: result.rows[0]});
    } catch (error) {
      console.error(error);
      res.status(500).json(ErrorInternalServer);
    }
  } else {
    res.status(401).json(ErrorUnauthorized);
  }
};

const getUserExercise = async (req, res) => {
  if (req.user && req.user.userId) {
    const userId = req.user.userId;
    try {
      const selectQuery = `SELECT * FROM user_exercise JOIN exercise ON exercise.exercise_id = user_exercise.exercise_id WHERE user_id = ${userId} ORDER BY created_date DESC`;
      const result = await client.query(selectQuery);
      res.status(200).json({items: result.rows});
    } catch (error) {
      console.error(error);
      res.status(500).json(ErrorInternalServer);
    }
  } else {
    res.status(401).json(ErrorUnauthorized);
  }
};

const getUserTask = async (req, res) => {
  if (req.user && req.user.userId) {
    const userId = req.user.userId;
    try {
      const selectQuery = `SELECT * FROM user_task JOIN task ON task.task_id = user_task.task_id WHERE user_id = ${userId} ORDER BY created_date DESC`;
      const result = await client.query(selectQuery);
      res.status(200).json({items: result.rows});
    } catch (error) {
      console.error(error);
      res.status(500).json(ErrorInternalServer);
    }
  } else {
    res.status(401).json(ErrorUnauthorized);
  }
};

module.exports = { getUserDetail, getUserExercise, getUserTask };
