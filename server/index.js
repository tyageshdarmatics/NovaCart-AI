require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Cluster.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/cart', require('./routes/cart'));
app.use('/api/merchandising', require('./routes/merchandising'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/search', require('./routes/search'));
app.use('/api/offers', require('./routes/offers'));

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', engine: 'NovaCart AI', version: '1.0' });
});

// React Catch-all Route
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`NovaCart AI Engine running on port ${PORT}`);
});
