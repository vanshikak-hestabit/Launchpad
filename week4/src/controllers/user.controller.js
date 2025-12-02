const UserRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');
const { addEmailJob } = require('../jobs/email.job.js');

// GET all users
async function getAll(req, res, next) {
  try {
    logger.info(`${req.requestId} - Fetching all users`);
    const users = await UserRepository.findAll();
    logger.info(`${req.requestId} - Users fetched successfully`);
    res.json({ success: true, users, requestId: req.requestId });

  } catch (err) {
    next(err);
  }
}

// GET user by ID
async function getById(req, res, next) {
  try {
    logger.info(`${req.requestId} - Fetching user with id=${req.params.id}`); 
    const user = await UserRepository.findById(req.params.id);
    if (!user){
      logger.warn(`${req.requestId} - User not found`);
      return res.status(404).json({ success: false, message: 'User not found' });
    } 

    res.json({ success: true, user, requestId: req.requestId });
  } catch (err) {
    next(err);
  }
}

// POST create user
async function create(req, res, next) {
  try {
    logger.info(`${req.requestId} - Creating user`);
    const user = await UserRepository.create(req.body);

    // call addEmailJob,add the job in queue -> email.job puts the job in queue-> email.worker see the job and sends the real email
    //await addEmailJob(user.email, 'Welcome!', 'Your account has been created.');
    res.status(201).json({ success: true, message: 'User created successfully!', user });

      await addEmailJob(
      user.email, 
      "Welcome to our app!", 
      `Hello ${user.firstName}, your account was created successfully.`
    );

    console.log('email has been sent succesfully')

  } catch (err) {
    next(err);
  }
}

// PUT update user
async function update(req, res, next) {
  try {
    logger.info(`${req.requestId} - Updating user id=${req.params.id}`);
    const updated = await UserRepository.update(req.params.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE user
async function remove(req, res, next) {
  try {
    logger.info(`${req.requestId} - Deleting user id=${req.params.id}`);
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

// it takes the request-> do logic-> return response
// uses repository to get data from DB