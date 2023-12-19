CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    pass VARCHAR(255),
    age INT,
    gender VARCHAR(10),
    weight INT,
    height INT,
    activity_freq INT,
    fitness_level VARCHAR(50),
    primary_goal VARCHAR(50),
    equipments VARCHAR(255) ARRAY,
    points INT DEFAULT 0
);

CREATE TABLE task (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255),
    task_desc VARCHAR(1000),
    points INT DEFAULT 0,
    created_date DATE,
    end_date DATE
);

CREATE TABLE exercise (
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(255),
    exercise_desc VARCHAR(1000),
    type VARCHAR(255),
    bodypart VARCHAR(255) ARRAY,
    equipments VARCHAR(255) ARRAY,
    level VARCHAR(255)
);

CREATE TABLE user_task (
    user_id INT,
    task_id INT,
    rate INT,
    img VARCHAR(255),
    status VARCHAR(10) CHECK (status IN ('APPROVED', 'PENDING', 'REJECTED')),
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


INSERT INTO users (name, email, pass, age, gender, weight, height, activity_freq, fitness_level, primary_goal, equipments, points)
VALUES 
  ('Admin', 'admin@gmail.com', '$2a$10$2pzqq1oKYX1qA1cGxLyA9uAEyQfgTE100SxwqfzjQCmyhs1BCagU.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('John Doe', 'john@example.com', '$2a$10$z4XQGOKA.v2pl8vI.wMJSOaReJJW2zWtNC7uBlMWfRWuKSyl9xnfy', 30, 'male', 75, 180, 4, 'Intermediate', 'Muscle Gain', ARRAY['Bands', 'Barbell', 'Kettlebells', 'Dumbbell', 'Cable', 'Machine', 'Body Only', 'Medicine Ball', 'Exercise Ball', 'Foam Roll', 'E-Z Curl Bar'], 30),
  ('Jane Smith', 'jane@example.com', '$2a$10$DFPe.5IDQv6g2rZTigVHYuGsh0F.J6c5PYgcJRt831bMix9wUGycS', 28, 'female', 60, 165, 5, 'Advanced', 'Weight Loss', ARRAY['Bands', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Body Only', 'Medicine Ball', 'Foam Roll', 'E-Z Curl Bar'], 50),
  ('Alice Johnson', 'alice@example.com', '$2a$10$Fq29mrNzCRcmdN1bkCv4U.efpxR92oWCKQj2ZPHU/UMaW33cR9L7q', 35, 'female', 70, 170, 3, 'Beginner', 'General Fitness', ARRAY['Kettlebells', 'Cable', 'Medicine Ball','Foam Roll'], 10);

INSERT INTO task (task_name, task_desc, points, created_date, end_date)
VALUES 
  ('Run 5 miles', 'Run 5 miles in the park', 10, '2023-06-22', '2024-06-22'),
  ('Push-up Challenge', 'Complete 100 push-ups daily', 10, '2023-07-25', '2024-07-25'),
  ('Drink Water', 'Drink 8 glasses of water daily', 10, '2023-08-29', '2024-08-29');

INSERT INTO exercise (exercise_name, exercise_desc, type, bodypart, equipments, level)
VALUES
  ('Partner plank band row', 'The partner plank band row is an abdominal exercise where two partners perform single-arm planks while pulling on the opposite ends of an exercise band. This technique can be done for time or reps in any ab-focused workout.', 'Strength', ARRAY['Abdominals'], ARRAY['Bands'], 'Intermediate'),
  ('Banded crunch isometric hold', 'The banded crunch isometric hold is an exercise targeting the abdominal muscles, particularly the rectus abdominis or "six-pack" muscles. The band adds resistance and continuous tension to this popular exercise.', 'Strength', ARRAY['Abdominals'], ARRAY['Bands'], 'Intermediate'),
  ('FYR Banded Plank Jack', 'The banded plank jack is a variation on the plank that involves moving the legs in and out for repetitions. Having a band around the thighs forces the lower body to work harder, particularly the hips and glutes. The plank jack is commonly performed as part of a bodyweight circuit, or as part of a dynamic warm-up.', 'Strength', ARRAY['Abdominals'], ARRAY['Bands'], 'Intermediate');

INSERT INTO user_task (user_id, task_id, rate, img, status)
VALUES 
  (1, 1, 4, 'src/uploads/running.jpg', 'PENDING'),
  (2, 2, 5, 'src/uploads/running.jpg', 'PENDING'),
  (3, 3, 3, 'src/uploads/running.jpg', 'PENDING');

INSERT INTO user_exercise (user_id, exercise_id, rate, img)
VALUES 
  (1, 1, 4, 'src/uploads/running.jpg'),
  (2, 2, 5, 'src/uploads/running.jpg'),
  (3, 3, 3, 'src/uploads/running.jpg');