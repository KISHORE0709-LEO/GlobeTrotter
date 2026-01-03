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

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, phone, bio, preferred_currency, timezone, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      bio: user.bio,
      preferredCurrency: user.preferred_currency,
      timezone: user.timezone,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all destinations for filtering
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.name as city_name, co.name as country_name, co.iso_code,
             c.latitude, c.longitude, c.average_cost_per_day,
             COUNT(DISTINCT td.trip_id) as trip_count
      FROM cities c
      JOIN countries co ON c.country_id = co.id
      LEFT JOIN trip_destinations td ON c.id = td.city_id
      GROUP BY c.id, c.name, co.name, co.iso_code, c.latitude, c.longitude, c.average_cost_per_day
      ORDER BY trip_count DESC, c.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attractions for a city
app.get('/api/destinations/:cityId/attractions', async (req, res) => {
  try {
    const { cityId } = req.params;
    const result = await pool.query(
      'SELECT * FROM attractions WHERE city_id = $1 AND is_active = true ORDER BY rating DESC',
      [cityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get attractions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search destinations
app.get('/api/destinations/search', async (req, res) => {
  try {
    const { q, budget_min, budget_max } = req.query;
    let query = `
      SELECT c.id, c.name as city_name, co.name as country_name, co.iso_code,
             c.latitude, c.longitude, c.average_cost_per_day
      FROM cities c
      JOIN countries co ON c.country_id = co.id
      WHERE 1=1
    `;
    const params = [];
    
    if (q) {
      params.push(`%${q}%`);
      query += ` AND (c.name ILIKE $${params.length} OR co.name ILIKE $${params.length})`;
    }
    
    if (budget_min) {
      params.push(budget_min);
      query += ` AND c.average_cost_per_day >= $${params.length}`;
    }
    
    if (budget_max) {
      params.push(budget_max);
      query += ` AND c.average_cost_per_day <= $${params.length}`;
    }
    
    query += ' ORDER BY c.name LIMIT 50';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Search destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user trips
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trip categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trip_categories ORDER BY category');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search destinations with filters
app.get('/api/destinations/search', async (req, res) => {
  try {
    const { q, budget_min, budget_max, category } = req.query;
    let query = `
      SELECT DISTINCT c.id, c.name as city_name, co.name as country_name, co.iso_code,
             c.latitude, c.longitude, c.average_cost_per_day,
             (SELECT image_url FROM attractions WHERE city_id = c.id LIMIT 1) as image_url
      FROM cities c
      JOIN countries co ON c.country_id = co.id
      LEFT JOIN attractions a ON c.id = a.city_id
      WHERE 1=1
    `;
    const params = [];
    
    if (q) {
      params.push(`%${q}%`);
      query += ` AND (c.name ILIKE $${params.length} OR co.name ILIKE $${params.length})`;
    }
    
    if (budget_min) {
      params.push(budget_min);
      query += ` AND c.average_cost_per_day >= $${params.length}`;
    }
    
    if (budget_max) {
      params.push(budget_max);
      query += ` AND c.average_cost_per_day <= $${params.length}`;
    }
    
    if (category) {
      params.push(category);
      query += ` AND a.category = $${params.length}`;
    }
    
    query += ' ORDER BY c.name LIMIT 50';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Search destinations error:', error);
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