const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  deadline:    { type: Date, required: true },
  team:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress:    { type: Number, min: 0, max: 100, default: 0 },
  tasks:       [taskSchema],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget:      { type: Number },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 