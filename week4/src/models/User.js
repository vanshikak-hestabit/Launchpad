// import mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // for hashing passwords

// define User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // validation: must have firstName
    trim: true // removes extra spaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // each email must be unique
    lowercase: true, // transform to lowercase
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook: hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) { // only hash if password changed
    this.password = await bcrypt.hash(this.password, 10);
    next
  }
});

// Virtual field: fullName
userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

// Compound index: { status: 1, createdAt: -1 }
userSchema.index({ status: 1, createdAt: -1 });

// create User model
const User = mongoose.model('User', userSchema);

module.exports = User;

// This defines how a User is stored in MongoDB.