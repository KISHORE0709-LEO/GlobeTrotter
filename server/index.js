const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./globetrotter.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    status TEXT DEFAULT 'planning',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS trip_destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER,
    city_name TEXT NOT NULL,
    country_name TEXT NOT NULL,
    arrival_date DATE,
    departure_date DATE,
    budget DECIMAL(10,2),
    FOREIGN KEY (trip_id) REFERENCES trips (id)
  )`);
});

// Email validation
const emailValidator = body('email').isEmail().normalizeEmail();
const passwordValidator = body('password').isLength({ min: 6 });

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

// Auth routes
app.post('/api/register', [emailValidator, passwordValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
    [email, hashedPassword, name], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const token = jwt.sign({ id: this.lastID, email }, 'secret_key');
    res.json({ token, user: { id: this.lastID, email, name } });
  });
});

app.post('/api/login', [emailValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email }, 'secret_key');
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });
});

// Trip routes
app.get('/api/trips', authenticateToken, (req, res) => {
  db.all('SELECT * FROM trips WHERE user_id = ?', [req.user.id], (err, trips) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(trips);
  });
});

app.post('/api/trips', authenticateToken, [
  body('title').notEmpty().trim(),
  body('budget').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, start_date, end_date, budget } = req.body;
  
  db.run('INSERT INTO trips (user_id, title, description, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, title, description, start_date, end_date, budget], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Real-time notification
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'trip_created', tripId: this.lastID }));
      }
    });
    
    res.json({ id: this.lastID, message: 'Trip created successfully' });
  });
});

// Cities API
app.get('/api/cities', (req, res) => {
  const { country, maxCost, search } = req.query;
  let query = 'SELECT * FROM cities WHERE 1=1';
  let params = [];

  if (country) {
    query += ' AND country_name LIKE ?';
    params.push(`%${country}%`);
  }
  
  if (maxCost) {
    query += ' AND average_cost_per_day <= ?';
    params.push(maxCost);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, cities) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(cities);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});