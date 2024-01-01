// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'KOki#67890',
  database: 'task_board_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform user authentication
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (match) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Save the user to the database
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json({ message: 'Registration successful' });
        }
      });
    }
  });
});

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  // Perform authentication check (you can use JWTs, session, etc.)
  // For simplicity, you can add authentication logic here
  // For example, check if there's a valid session or token
  // For a real-world application, use a proper authentication strategy
  next();
};

// Endpoint for creating a new list
app.post('/lists', authenticateUser, (req, res) => {
  const { userId, listName } = req.body;

  // Save the new list to the database
  db.query('INSERT INTO lists (user_id, list_name) VALUES (?, ?)', [userId, listName], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'List created successfully' });
    }
  });
});

// Endpoint for fetching all lists for a user
app.get('/lists/:userId', authenticateUser, (req, res) => {
  const userId = req.params.userId;

  // Retrieve lists from the database for the specified user
  db.query('SELECT * FROM lists WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint for updating a list
app.put('/lists/:listId', authenticateUser, (req, res) => {
  const listId = req.params.listId;
  const newListName = req.body.newListName;

  // Update the list name in the database
  db.query('UPDATE lists SET list_name = ? WHERE id = ?', [newListName, listId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'List updated successfully' });
    }
  });
});

// Endpoint for deleting a list
app.delete('/lists/:listId', authenticateUser, (req, res) => {
  const listId = req.params.listId;

  // Delete the list from the database
  db.query('DELETE FROM lists WHERE id = ?', [listId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'List deleted successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
