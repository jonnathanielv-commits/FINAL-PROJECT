const express = require('express');
const router = express.Router();
const {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  listExercisesInWorkout,
} = require('../controllers/workoutController');

router.get('/', getAllWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

// Relationship-specific endpoints
router.get('/:id/exercises', listExercisesInWorkout);
router.post('/:id/exercises', addExerciseToWorkout);
router.delete('/:id/exercises/:exerciseId', removeExerciseFromWorkout);

module.exports = router;
