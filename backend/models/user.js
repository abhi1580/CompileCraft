const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function addUser(user) {
  const newUser = new User(user);
  return await newUser.save();
}

module.exports = {
  User,
  findUserByEmail,
  addUser,
}; 