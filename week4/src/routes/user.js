const express = require('express');
const UserRepository = require('../repositories/user.repository');

const router = express.Router();

// POST /api/users → create a new user
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const user = await UserRepository.create(data);
    res.json({
      message: 'User created successfully!',
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
