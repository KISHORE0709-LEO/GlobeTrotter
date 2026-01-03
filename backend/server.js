const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'globetrotter_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'globetrotter_db',
  password: process.env.DB_PASSWORD || 'globetrotter_pass_2024',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobeTrotter API is running' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, first_name, last_name',
      [email, username, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, username, password_hash, first_name, last_name FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user trips
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trip_details WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get popular destinations
app.get('/api/destinations/popular', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM popular_destinations LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create trip
app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { title, description, startDate, endDate, totalBudget, currency } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    const result = await pool.query(
      'INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, currency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.userId, title, description, startDate, endDate, totalBudget, currency]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});