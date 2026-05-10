const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Junction table for the many-to-many between Workout <-> Exercise
const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  weight_kg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'workout_exercises',
  timestamps: true,
});

module.exports = WorkoutExercise;
