require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/voting_dapp').then(async () => {
  console.log("Connected to MongoDB successfully");
  // Seed admin user securely if not exists
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('parth123', salt);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log("Admin user seeded.");
  }
}).catch(err => console.error("MongoDB Connection Error:", err));

// Auto-generated JWT Secret for local dev
const SECRET = process.env.JWT_SECRET || 'super_secret_resume_key_2024';

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Routes

// 1. Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, role: user.role, username: user.username }, SECRET);
    res.json({ token, role: user.role, username: user.username, hasVoted: user.hasVoted });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Current User Data
app.get('/api/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Mark user as voted (Layer 2 DB validation)
app.post('/api/vote/record', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user.hasVoted) return res.status(400).json({ message: "Already Voted!" });
      user.hasVoted = true;
      await user.save();
      res.json({ message: "Vote successfully matched on database." });
    } catch(err) {
      res.status(500).json({ error: err.message });
    }
});

// 5. Admin Dashboard Metrics
app.get('/api/admin/metrics', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Access Denied: Admin only" });
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVotes = await User.countDocuments({ role: 'user', hasVoted: true });
    
    // Also send list of users for the dashboard
    const users = await User.find({ role: 'user' }).select('username hasVoted');
    res.json({ totalUsers, totalVotes, users });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
