const Job = require('../models/job');
const JobApplication = require('../models/jobApplication');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
exports.uploadResume = upload.single('resume');

// GET /jobs (public)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: err.message });
  }
};

// POST /jobs (admin only)
exports.addJob = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add jobs' });
  }
  const { title, location, type, description, experience, technologies, fields } = req.body;
  if (!title || !location || !type || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  let techArr = [];
  if (Array.isArray(technologies)) techArr = technologies;
  else if (typeof technologies === 'string') techArr = technologies.split(',').map(t => t.trim()).filter(Boolean);
  let fieldsArr = [];
  if (Array.isArray(fields)) fieldsArr = fields.filter(f => f.name && f.value);
  try {
    const job = new Job({ title, location, type, description, experience, technologies: techArr, fields: fieldsArr });
    await job.save();
    res.json({ message: 'Job added', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add job', details: err.message });
  }
};

// DELETE /jobs/:id (admin only)
exports.deleteJob = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete jobs' });
  }
  const { id } = req.params;
  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job', details: err.message });
  }
};

// POST /jobs/:id/apply (public)
exports.applyForJob = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, coverLetter } = req.body;
  let resumePath = req.file ? req.file.path : undefined;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const application = new JobApplication({
      job: id,
      name,
      email,
      phone,
      coverLetter,
      resume: resumePath
    });
    await application.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application', details: err.message });
  }
};

// GET /job-applications (admin only)
exports.getJobApplications = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view job applications' });
  }
  try {
    const applications = await JobApplication.find().populate('job', 'title');
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job applications', details: err.message });
  }
}; 