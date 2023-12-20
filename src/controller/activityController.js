const { ErrorInternalServer } = require("../common/commonResponse");
const { client } = require("../db");

const getAllActivity = async (req, res) => {
  try {
    const query = "SELECT * FROM exercise";

    const queryResult = await client.query(query);

    res.status(201).json({
      error: false,
      message: "Success",
      data: queryResult.rows,
    });
  } catch (error) {
    res.status(500).json(ErrorInternalServer);
  }
};

const getActivity = async (req, res) => {
  const exercise_id = req.params.id;

  try {
    const query = `SELECT * FROM exercise WHERE exercise_id = ${exercise_id}`;

    const queryResult = await client.query(query);

    if (queryResult.rows.length == 0) {
      res.status(400).json({
        error: true,
        message: "Exercise not found",
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

module.exports = { getAllActivity, getActivity };
