const { client } = require("../db");

const submitTask = async (req, res) => {
	res.status(200).json({ message: "task submitted" });
};
module.exports = { submitTask };
