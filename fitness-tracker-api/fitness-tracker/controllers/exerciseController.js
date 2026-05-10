const { Exercise } = require('../models');

// GET /exercises
async function getAllExercises(req, res, next) {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
}

// GET /exercises/:id
async function getExerciseById(req, res, next) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Not Found', message: `Exercise with id ${req.params.id} not found.` });
    }
    res.json(exercise);
  } catch (err) {
    next(err);
  }
}

// POST /exercises
async function createExercise(req, res, next) {
  try {
    const { name, muscle_group, description, equipment } = req.body;

    if (!name || !muscle_group) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Fields "name" and "muscle_group" are required.',
      });
    }

    const exercise = await Exercise.create({ name, muscle_group, description, equipment });
    res.status(201).json(exercise);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Bad Request', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
}

// PUT /exercises/:id
async function updateExercise(req, res, next) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Not Found', message: `Exercise with id ${req.params.id} not found.` });
    }

    const { name, muscle_group, description, equipment } = req.body;
    await exercise.update({ name, muscle_group, description, equipment });
    res.json(exercise);
  } catch (err) {
    next(err);
  }
}

// DELETE /exercises/:id
async function deleteExercise(req, res, next) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Not Found', message: `Exercise with id ${req.params.id} not found.` });
    }
    await exercise.destroy();
    res.json({ message: `Exercise ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllExercises, getExerciseById, createExercise, updateExercise, deleteExercise };
