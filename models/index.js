const sequelize = require('../config/database');
const User = require('./User');
const Workout = require('./Workout');
const Exercise = require('./Exercise');
const WorkoutExercise = require('./WorkoutExercise');

// One-to-many: User hasMany Workouts
User.hasMany(Workout, { foreignKey: 'userId', as: 'workouts', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many-to-many: Workout <-> Exercise through WorkoutExercise
Workout.belongsToMany(Exercise, {
  through: WorkoutExercise,
  foreignKey: 'workoutId',
  otherKey: 'exerciseId',
  as: 'exercises',
});
Exercise.belongsToMany(Workout, {
  through: WorkoutExercise,
  foreignKey: 'exerciseId',
  otherKey: 'workoutId',
  as: 'workouts',
});

module.exports = { sequelize, User, Workout, Exercise, WorkoutExercise };
