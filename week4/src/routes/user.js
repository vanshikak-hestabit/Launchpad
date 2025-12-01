const express = require('express');
const validate = require('../middlewares/validate');
const { createUserSchema } = require('../models/user.schema');
const UserController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', validate(createUserSchema), UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

module.exports = router;
