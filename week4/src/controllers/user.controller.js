const UserRepository = require('../repositories/user.repository');

// GET all users
async function getAll(req, res, next) {
  try {
    const users = await UserRepository.findAll();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

// GET user by ID
async function getById(req, res, next) {
  try {
    const user = await UserRepository.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// POST create user
async function create(req, res, next) {
  try {
    const user = await UserRepository.create(req.body);
    res.status(201).json({ success: true, message: 'User created successfully!', user });
  } catch (err) {
    next(err);
  }
}

// PUT update user
async function update(req, res, next) {
  try {
    const updated = await UserRepository.update(req.params.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE user
async function remove(req, res, next) {
  try {
    await UserRepository.delete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
