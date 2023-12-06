const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const pickedExerciseRoutes = require("./routes/pickedExerciseRoutes");
const pickedTaskRoutes = require("./routes/pickedTaskRoutes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/activity", activityRoutes);
app.use("/task", taskRoutes);
app.use("/picked-exercise", pickedExerciseRoutes);
app.use("/picked-task", pickedTaskRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
