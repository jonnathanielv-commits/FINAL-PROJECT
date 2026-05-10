const { Workout, User, Exercise, WorkoutExercise } = require('../models');

// GET /workouts
async function getAllWorkouts(req, res, next) {
  try {
    const workouts = await Workout.findAll({ include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] });
    res.json(workouts);
  } catch (err) {
    next(err);
  }
}

// GET /workouts/:id
async function getWorkoutById(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Exercise, as: 'exercises', through: { attributes: ['sets', 'reps', 'weight_kg', 'duration_seconds'] } },
      ],
    });
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }
    res.json(workout);
  } catch (err) {
    next(err);
  }
}

// POST /workouts
async function createWorkout(req, res, next) {
  try {
    const { title, date, duration_minutes, notes, userId } = req.body;

    if (!title || !date || !duration_minutes || !userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Fields "title", "date", "duration_minutes", and "userId" are required.',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `User with id ${userId} not found.` });
    }

    const workout = await Workout.create({ title, date, duration_minutes, notes, userId });
    res.status(201).json(workout);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Bad Request', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
}

// PUT /workouts/:id
async function updateWorkout(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }

    const { title, date, duration_minutes, notes } = req.body;
    await workout.update({ title, date, duration_minutes, notes });
    res.json(workout);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Bad Request', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
}

// DELETE /workouts/:id
async function deleteWorkout(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }
    await workout.destroy();
    res.json({ message: `Workout ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

// POST /workouts/:id/exercises  — add an exercise to a workout
async function addExerciseToWorkout(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }

    const { exerciseId, sets, reps, weight_kg, duration_seconds } = req.body;
    if (!exerciseId) {
      return res.status(400).json({ error: 'Bad Request', message: '"exerciseId" is required.' });
    }

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Not Found', message: `Exercise with id ${exerciseId} not found.` });
    }

    await workout.addExercise(exercise, { through: { sets, reps, weight_kg, duration_seconds } });

    const updated = await Workout.findByPk(req.params.id, {
      include: [{ model: Exercise, as: 'exercises', through: { attributes: ['sets', 'reps', 'weight_kg', 'duration_seconds'] } }],
    });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /workouts/:id/exercises/:exerciseId  — remove an exercise from a workout
async function removeExerciseFromWorkout(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }

    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Not Found', message: `Exercise with id ${req.params.exerciseId} not found.` });
    }

    await workout.removeExercise(exercise);
    res.json({ message: `Exercise ${req.params.exerciseId} removed from workout ${req.params.id}.` });
  } catch (err) {
    next(err);
  }
}

// GET /workouts/:id/exercises  — list exercises in a workout
async function listExercisesInWorkout(req, res, next) {
  try {
    const workout = await Workout.findByPk(req.params.id, {
      include: [{ model: Exercise, as: 'exercises', through: { attributes: ['sets', 'reps', 'weight_kg', 'duration_seconds'] } }],
    });
    if (!workout) {
      return res.status(404).json({ error: 'Not Found', message: `Workout with id ${req.params.id} not found.` });
    }
    res.json(workout.exercises);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  listExercisesInWorkout,
};
