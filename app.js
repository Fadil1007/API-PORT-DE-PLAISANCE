const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const catwaysRoutes = require('./routes/catways');
const usersRoutes = require('./routes/users');
const reservationsRoutes = require('./routes/reservations');
const User = require('./models/User');
const auth = require('./middlewares/auth');

require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/API')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Documentation JSDoc
app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.use('/api/catways', catwaysRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reservations', reservationsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.post('/hash', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  res.json({ hash });
});
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
