const { client } = require("../db");

const submitExercise = async (req, res) => {
	res.status(200).json({ message: "exercise submitted" });
};
module.exports = { submitExercise };
