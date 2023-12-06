const { client } = require("../db");

const getAllTask = async (req, res) => {
	res.status(200).json({ message: "get all tasks" });
};

const getTask = async (req, res) => {
	res.status(200).json({ message: "get detail task" });
};

const createTask = async (req, res) => {
	res.status(200).json({ message: "create task" });
};

module.exports = { getAllTask, getTask, createTask };
