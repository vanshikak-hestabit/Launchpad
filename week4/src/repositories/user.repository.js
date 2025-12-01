const User = require('../models/User');

class UserRepository {
  // Create new user
  static async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  static async findAll() {
    return User.find().select('-password'); // exclude password
  }

  // Find user by ID
  static async findById(id) {
    return User.findById(id);
  }

  // Paginated users
  static async findPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit);
    return users;
  }

  // Update user
  static async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete user
  static async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;
