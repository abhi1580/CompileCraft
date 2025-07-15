const { User } = require('../models/user');

// PATCH /users/:id
exports.updateUser = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update users' });
  }
  const { id } = req.params;
  const { name, email, phone, designation, techStack } = req.body;
  try {
    const update = { name, email, phone, designation };
    if (Array.isArray(techStack)) update.techStack = techStack;
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete users' });
  }
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
}; 