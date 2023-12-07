CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    pass VARCHAR(255),
    age INT,
    gender BOOLEAN,
    weight INT,
    height INT,
    activity_freq INT,
    fitness_level VARCHAR(50),
    primary_goal VARCHAR(50),
    equipment VARCHAR(255) ARRAY
);

CREATE TABLE task (
    task_id SERIAL PRIMARY KEY,
    category VARCHAR(255),
    task_name VARCHAR(255),
    task_desc VARCHAR(255),
    created_date DATE,
    end_date DATE
);

CREATE TABLE exercise (
    exercise_id SERIAL PRIMARY KEY,
    category VARCHAR(255),
    exercise_name VARCHAR(255),
    exercise_desc VARCHAR(255),
    type VARCHAR(255),
    bodypart VARCHAR(255) ARRAY,
    equipment VARCHAR(255) ARRAY,
    level VARCHAR(255)
);

CREATE TABLE user_task (
    user_id INT,
    task_id INT,
    rate INT,
    img VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (task_id) REFERENCES task(task_id),
    PRIMARY KEY (user_id, task_id)
);

CREATE TABLE user_exercise (
    user_id INT,
    exercise_id INT,
    rate INT,
    img VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id),
    PRIMARY KEY (user_id, exercise_id)
);


INSERT INTO users (name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipment)
VALUES 
  ('John Doe', 'john@example.com', 'password123', 30, true, 75, 180, 4, 'Intermediate', 'Muscle Gain', ARRAY['Bands', 'Barbell', 'Kettlebells', 'Dumbbell', 'Cable', 'Machine', 'Body Only', 'Medicine Ball', 'Exercise Ball', 'Foam Roll', 'E-Z Curl Bar']),
  ('Jane Smith', 'jane@example.com', 'pass321', 28, false, 60, 165, 5, 'Advanced', 'Weight Loss', ARRAY['Bands', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Body Only', 'Medicine Ball', 'Foam Roll', 'E-Z Curl Bar']),
  ('Alice Johnson', 'alice@example.com', 'securepass', 35, false, 70, 170, 3, 'Beginner', 'General Fitness', ARRAY['Kettlebells', 'Cable', 'Medicine Ball','Foam Roll']);

INSERT INTO task (category, task_name, task_desc, created_date, end_date)
VALUES 
  ('Fitness', 'Run 5 miles', 'Run 5 miles in the park', '2023-06-22', '2024-06-22'),
  ('Exercise', 'Push-up Challenge', 'Complete 100 push-ups daily', '2023-07-25', '2024-07-25'),
  ('Health', 'Drink Water', 'Drink 8 glasses of water daily', '2023-08-29', '2024-08-29');

INSERT INTO exercise (category, exercise_name, exercise_desc, type, bodypart, equipment, level)
VALUES 
  ('Cardio', 'Running', 'Run for 30 minutes', 'Cardiovascular', ARRAY['Legs'], ARRAY['Running Shoes'], 'Intermediate'),
  ('Strength', 'Push-ups', 'Perform 3 sets of 15 reps', 'Bodyweight', ARRAY['Chest', 'Arms'], ARRAY['Floor Mat'], 'Beginner'),
  ('Flexibility', 'Yoga', 'Practice basic yoga poses', 'Flexibility', ARRAY['Full Body'], ARRAY['Yoga Mat'], 'Beginner');

INSERT INTO user_task (user_id, task_id, rate, img)
VALUES 
  (1, 1, 4, 'run_image.jpg'),
  (2, 2, 5, 'pushup_image.jpg'),
  (3, 3, 3, 'water_image.jpg');

INSERT INTO user_exercise (user_id, exercise_id, rate, img)
VALUES 
  (1, 1, 4, 'running_image.jpg'),
  (2, 2, 5, 'pushups_image.jpg'),
  (3, 3, 3, 'yoga_image.jpg');