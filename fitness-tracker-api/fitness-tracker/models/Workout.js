const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // FK to User — added via association
}, {
  tableName: 'workouts',
  timestamps: true,
});

module.exports = Workout;
