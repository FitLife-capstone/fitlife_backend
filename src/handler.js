const { Client } = require("pg");

const client = new Client({
	host: "fitlife-db",
	user: "postgres",
	database: "fitlife_db",
	password: "123456",
});

client.connect();

const getUsers = async (req, res) => {
	try {
		const selectQuery = "SELECT * FROM users";
		const result = await client.query(selectQuery);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createUser = async (req, res) => {
    const { name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipment } = req.body;

    try {
        const insertQuery =
            "INSERT INTO users (name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

        const values = [name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipment];

        const result = await client.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { getUsers, createUser };
