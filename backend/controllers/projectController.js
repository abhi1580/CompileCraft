const Project = require('../models/project');
const User = require('../models/user').User;

function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('team', 'email role designation').populate('createdBy', 'email role');
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

exports.addProject = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add projects' });
  }
  const { name, description, status, deadline, team, budget, tasks } = req.body;
  if (!name || !deadline) {
    return res.status(400).json({ error: 'Name and deadline are required' });
  }
  let teamIds = [];
  if (Array.isArray(team)) {
    teamIds = await User.find({ _id: { $in: team } }).distinct('_id');
  }
  const projectData = {
    name,
    description,
    status,
    deadline,
    team: teamIds,
    budget,
    tasks: Array.isArray(tasks) ? tasks : [],
    createdBy: req.user && req.user._id ? req.user._id : undefined,
  };
  if (projectData.tasks.length > 0) {
    projectData.progress = calculateProgress(projectData.tasks);
  }
  try {
    const project = new Project(projectData);
    await project.save();
    await project.populate('team', 'email role designation');
    await project.populate('createdBy', 'email role');
    res.json({ message: 'Project added', project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project', details: err.message });
  }
};

exports.updateProject = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can edit projects' });
  }
  const { id } = req.params;
  const { name, description, status, deadline, team, budget, tasks } = req.body;
  let teamIds = [];
  if (Array.isArray(team)) {
    teamIds = await User.find({ _id: { $in: team } }).distinct('_id');
  }
  const update = {
    name,
    description,
    status,
    deadline,
    team: teamIds,
    budget,
    tasks: Array.isArray(tasks) ? tasks : [],
  };
  if (update.tasks.length > 0) {
    update.progress = calculateProgress(update.tasks);
  } else {
    update.progress = 0;
  }
  try {
    const project = await Project.findByIdAndUpdate(id, update, { new: true })
      .populate('team', 'email role designation')
      .populate('createdBy', 'email role');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete projects' });
  }
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
}; 