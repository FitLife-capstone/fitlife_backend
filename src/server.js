const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const progileRoutes = require("./routes/profileRoutes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", progileRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
