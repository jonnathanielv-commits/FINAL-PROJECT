const { User, Workout } = require('../models');

// GET /users
async function getAllUsers(req, res, next) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /users/:id
async function getUserById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Workout, as: 'workouts' }],
    });
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `User with id ${req.params.id} not found.` });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// POST /users
async function createUser(req, res, next) {
  try {
    const { name, email, age, weight_kg, height_cm } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Fields "name" and "email" are required.',
      });
    }

    const user = await User.create({ name, email, age, weight_kg, height_cm });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Bad Request', message: 'Email already in use.' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Bad Request', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
}

// PUT /users/:id
async function updateUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `User with id ${req.params.id} not found.` });
    }

    const { name, email, age, weight_kg, height_cm } = req.body;
    await user.update({ name, email, age, weight_kg, height_cm });
    res.json(user);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Bad Request', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
}

// DELETE /users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `User with id ${req.params.id} not found.` });
    }
    await user.destroy();
    res.json({ message: `User ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
