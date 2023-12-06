const { client } = require("../db");

const getAllActivity = async (req, res) => {
	res.status(200).json({ message: "get all activities" });
};

const getActivity = async (req, res) => {
	res.status(200).json({ message: "get detail acitivity" });
};

module.exports = { getAllActivity, getActivity };
