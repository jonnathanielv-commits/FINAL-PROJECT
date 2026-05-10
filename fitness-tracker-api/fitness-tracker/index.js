require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Custom Logger Middleware ─────────────────────────────────────────────────
app.use(logger);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running 💪', version: '1.0.0' });
});

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

// ─── 404 Catch-All ───────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler (must be last, must have 4 params) ─────────────────
app.use(errorHandler);

// ─── Database Sync & Server Start ────────────────────────────────────────────
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('✅ Database connected and tables synced.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });
