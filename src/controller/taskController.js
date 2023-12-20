const { ErrorInternalServer } = require("../common/commonResponse");
const { client } = require("../db");

const getAllTask = async (req, res) => {
  try {
    const query = "SELECT * FROM task ORDER BY created_date DESC";

    const queryResult = await client.query(query);

    if (queryResult.rows.length == 0) {
      res.status(201).json({
        error: false,
        message: "No active challenge",
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

const getAllActiveTask = async (req, res) => {
  try {
    const query =
      "SELECT * FROM task WHERE end_date >= CURRENT_DATE  ORDER BY created_date DESC";

    const queryResult = await client.query(query);

    if (queryResult.rows.length == 0) {
      res.status(201).json({
        error: false,
        message: "No active challenge",
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

const getTask = async (req, res) => {
  const task_id = req.params.id;

  try {
    const query = `SELECT * FROM task WHERE task_id = ${task_id}`;

    const queryResult = await client.query(query);

    if (queryResult.rows.length == 0) {
      res.status(400).json({
        error: true,
        message: "Task not found",
      });
      return;
    }

    res.status(201).json({
      error: false,
      message: "Success",
      data: queryResult.rows[0],
    });
  } catch (error) {
    res.status(500).json(ErrorInternalServer);
  }
};

const createTask = async (req, res) => {
  if (req.user && req.user.role === "admin") {
    const { task_name, task_desc, points, start_at, end_at } = req.body;

    if (!task_name || !task_desc || !points || !start_at || !end_at) {
      res.status(400).json({
        error: true,
        message: "Missing required fields",
      });

      return;
    } else if (start_at > end_at) {
      res.status(400).json({
        error: true,
        message: "Start date must be before end date",
      });
      return;
    } else {
      try {
        const insertQuery =
          "INSERT INTO task (task_name, task_desc, points, created_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *";

        const values = [task_name, task_desc, points, start_at, end_at];

        const resultQuery = await client.query(insertQuery, values);
        res.status(201).json({
          error: false,
          message: "Task created",
          data: resultQuery.rows[0],
        });
      } catch (error) {
        res.status(500).json(ErrorInternalServer);
      }
    }
  } else {
    res
      .status(403)
      .json({
        error: true,
        message: "Forbidden: Only admin can perform this action",
      });
  }
};

module.exports = { getAllTask, getTask, createTask, getAllActiveTask };
