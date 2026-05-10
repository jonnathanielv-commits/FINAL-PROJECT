# Fitness Tracker API

## About

The Fitness Tracker API is a RESTful backend application designed to help users log, manage, and review their fitness activities. The core problem it solves is simple: people who exercise regularly need a structured way to track what workouts they complete, how long they last, and which exercises they performed during each session — including details like sets, reps, and weight used.

This application manages three primary resources: **Users**, **Workouts**, and **Exercises**. A User represents a person using the fitness tracker, storing basic profile information such as their name, email, age, weight, and height. A Workout represents a single training session tied to a specific User, capturing when it occurred, how long it lasted, and any personal notes. An Exercise is a reusable movement definition — like "Barbell Squat" or "Push-Up" — that describes which muscle group is targeted and what equipment is needed.

The interesting design challenge lies in the relationship between Workouts and Exercises: a single workout can include many exercises, and the same exercise can appear in many different workouts. This many-to-many relationship is captured through a junction model called `WorkoutExercise`, which stores additional per-session data for each pairing — such as how many sets and reps were performed, and how much weight was lifted. This allows the same exercise (e.g., "Bench Press") to appear in multiple workouts with different performance data each time.

The application is built using a clean MVC architecture with separate directories for models, controllers, routes, and middleware. Sequelize ORM handles all database interactions and auto-creates tables on startup, making the setup process straightforward. All database credentials are environment-variable driven, and a global error handler ensures unexpected failures are caught gracefully without exposing stack traces to clients. Input validation is applied to every POST route to reject incomplete requests with descriptive error messages.

This project was developed as the final requirement for CPE 114 Software Design, demonstrating practical backend engineering skills including relational data modeling, REST API design, middleware architecture, and documentation.

---

## Tech Stack

| Technology | Version |
|---|---|
| Node.js | >= 18.x |
| Express.js | ^4.19.2 |
| Sequelize ORM | ^6.37.3 |
| MySQL2 | ^3.9.7 |
| dotenv | ^16.4.5 |
| MySQL | 8.x |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fitness-tracker-api.git
cd fitness-tracker-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fitness_tracker
DB_USER=root
DB_PASSWORD=yourpassword
PORT=3000
```

### 4. Create the Database

Log in to MySQL and create the database:

```sql
CREATE DATABASE fitness_tracker;
```

### 5. Start the Server

```bash
npm start
```

Sequelize will automatically create all tables on startup. You should see:

```
✅ Database connected and tables synced.
🚀 Server running at http://localhost:3000
```

---

## Database Schema

### `users` table

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| age | INTEGER | nullable |
| weight_kg | FLOAT | nullable |
| height_cm | FLOAT | nullable |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `exercises` table

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| muscle_group | VARCHAR(80) | NOT NULL |
| description | TEXT | nullable |
| equipment | VARCHAR(80) | default: 'None' |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `workouts` table

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(150) | NOT NULL |
| date | DATEONLY | NOT NULL |
| duration_minutes | INTEGER | NOT NULL, min: 1 |
| notes | TEXT | nullable |
| userId | INTEGER | FOREIGN KEY → users.id, CASCADE DELETE |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `workout_exercises` table (Junction)

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| workoutId | INTEGER | FOREIGN KEY → workouts.id |
| exerciseId | INTEGER | FOREIGN KEY → exercises.id |
| sets | INTEGER | nullable, default: 1 |
| reps | INTEGER | nullable |
| weight_kg | FLOAT | nullable |
| duration_seconds | INTEGER | nullable |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

---

## ER Diagram

```
┌───────────────┐         ┌─────────────────────┐         ┌────────────────────┐
│     users     │         │      workouts        │         │     exercises      │
│───────────────│         │─────────────────────│         │────────────────────│
│ id (PK)       │◄──1──┐  │ id (PK)             │  ┌──M──►│ id (PK)            │
│ name          │      └──│ userId (FK)          │  │      │ name               │
│ email         │         │ title                │  │      │ muscle_group       │
│ age           │         │ date                 │  │      │ description        │
│ weight_kg     │         │ duration_minutes     │  │      │ equipment          │
│ height_cm     │         │ notes                │  │      └────────────────────┘
└───────────────┘         └─────────────────────┘  │
                                    │ M             │
                                    ▼               │
                          ┌──────────────────────┐  │
                          │  workout_exercises    │  │
                          │──────────────────────│  │
                          │ id (PK)              │  │
                          │ workoutId (FK)  ─────┘  │
                          │ exerciseId (FK) ─────────┘
                          │ sets                 │
                          │ reps                 │
                          │ weight_kg            │
                          │ duration_seconds     │
                          └──────────────────────┘

Relationships:
  users     1 ──── M  workouts          (one user has many workouts)
  workouts  M ──── M  exercises         (via workout_exercises junction)
```

---

## API Reference

### Users

| Method | Path | Body | Description | Success |
|---|---|---|---|---|
| GET | /api/users | — | Get all users | 200 |
| GET | /api/users/:id | — | Get user by ID (includes workouts) | 200 |
| POST | /api/users | `name`, `email`, `age?`, `weight_kg?`, `height_cm?` | Create a new user | 201 |
| PUT | /api/users/:id | any user fields | Update a user | 200 |
| DELETE | /api/users/:id | — | Delete a user (cascades workouts) | 200 |

### Exercises

| Method | Path | Body | Description | Success |
|---|---|---|---|---|
| GET | /api/exercises | — | Get all exercises | 200 |
| GET | /api/exercises/:id | — | Get exercise by ID | 200 |
| POST | /api/exercises | `name`, `muscle_group`, `description?`, `equipment?` | Create an exercise | 201 |
| PUT | /api/exercises/:id | any exercise fields | Update an exercise | 200 |
| DELETE | /api/exercises/:id | — | Delete an exercise | 200 |

### Workouts

| Method | Path | Body | Description | Success |
|---|---|---|---|---|
| GET | /api/workouts | — | Get all workouts (with user info) | 200 |
| GET | /api/workouts/:id | — | Get workout by ID (with user + exercises) | 200 |
| POST | /api/workouts | `title`, `date`, `duration_minutes`, `userId`, `notes?` | Create a workout | 201 |
| PUT | /api/workouts/:id | any workout fields | Update a workout | 200 |
| DELETE | /api/workouts/:id | — | Delete a workout | 200 |
| GET | /api/workouts/:id/exercises | — | List exercises in a workout | 200 |
| POST | /api/workouts/:id/exercises | `exerciseId`, `sets?`, `reps?`, `weight_kg?`, `duration_seconds?` | Add exercise to workout | 201 |
| DELETE | /api/workouts/:id/exercises/:exerciseId | — | Remove exercise from workout | 200 |

---

## Example Responses

**POST /api/users** (201 Created)
```json
{
  "id": 1,
  "name": "Juan dela Cruz",
  "email": "juan@example.com",
  "age": 22,
  "weight_kg": 70,
  "height_cm": 175,
  "createdAt": "2025-06-01T08:00:00.000Z",
  "updatedAt": "2025-06-01T08:00:00.000Z"
}
```

**GET /api/workouts/1** (200 OK)
```json
{
  "id": 1,
  "title": "Morning Strength Session",
  "date": "2025-06-01",
  "duration_minutes": 60,
  "notes": "Focused on compound lifts.",
  "userId": 1,
  "user": { "id": 1, "name": "Juan dela Cruz", "email": "juan@example.com" },
  "exercises": [
    {
      "id": 1,
      "name": "Barbell Squat",
      "muscle_group": "Legs",
      "WorkoutExercise": { "sets": 4, "reps": 8, "weight_kg": 80, "duration_seconds": null }
    }
  ]
}
```

---

## Error Responses

| Status | When it occurs | JSON Structure |
|---|---|---|
| 400 | Missing required fields or invalid input | `{ "error": "Bad Request", "message": "..." }` |
| 404 | Record not found or undefined route | `{ "error": "Not Found", "message": "..." }` |
| 500 | Unexpected server error | `{ "error": "Internal Server Error", "message": "An unexpected error occurred. Please try again later." }` |

**Example 400:**
```json
{
  "error": "Bad Request",
  "message": "Fields \"name\" and \"email\" are required."
}
```

**Example 404:**
```json
{
  "error": "Not Found",
  "message": "User with id 99 not found."
}
```

---

## Project Structure

```
fitness-tracker-api/
├── config/
│   └── database.js          # Sequelize connection
├── controllers/
│   ├── userController.js
│   ├── workoutController.js
│   └── exerciseController.js
├── middleware/
│   ├── logger.js             # Custom request logger
│   └── errorHandler.js       # 404 catch-all + global error handler
├── models/
│   ├── index.js              # Associations
│   ├── User.js
│   ├── Workout.js
│   ├── Exercise.js
│   └── WorkoutExercise.js    # Junction model
├── routes/
│   ├── users.js
│   ├── workouts.js
│   └── exercises.js
├── docs/
│   └── postman_collection.json
├── .env.example
├── .gitignore
├── index.js                  # App entry point
├── package.json
└── README.md
```
