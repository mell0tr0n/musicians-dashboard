const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root test route
app.get('/', (req, res) => {
  res.send('Musician’s Dashboard Backend is running.');
});

// GET /projects - fetch all projects
app.get('/api/projects', (req, res) => {
  //confirm running latest version of code / that the route is being hit
  console.log('GET /api/projects called');
  db.all('SELECT * FROM projects ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST /projects - add a new project
app.post('/api/projects', (req, res) => {
  const { title, artist, chordsUrl, tags, notes, createdAt, lastUpdated } =
    req.body;

  db.run(
    `INSERT INTO projects (title, artist, chordsUrl, tags, notes, createdAt, lastUpdated)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, artist, chordsUrl, tags, notes, createdAt, lastUpdated],
    function (err) {
      if (err) {
        console.error('Error adding project:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT /projects/:id - update an existing project
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, artist, chordsUrl, tags, notes, createdAt, lastUpdated } =
    req.body;

  db.run(
    `UPDATE projects SET
      title = ?, artist = ?, chordsUrl = ?, tags = ?, notes = ?, createdAt = ?, lastUpdated = ?
     WHERE id = ?`,
    [title, artist, chordsUrl, tags, notes, createdAt, lastUpdated, id],
    function (err) {
      if (err) {
        console.error('Error updating project:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /projects/:id - delete a project
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM projects WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Error deleting project:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ deleted: this.changes });
  });
});

//temp test
app.get('/api/debug-projects', (req, res) => {
  db.all('SELECT * FROM projects LIMIT 5', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
