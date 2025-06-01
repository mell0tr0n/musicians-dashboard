const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all projects sorted by lastUpdated DESC
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY lastUpdated DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create a new project
app.post('/api/projects', (req, res) => {
  const {
    title,
    artist,
    chordsUrl,
    tags = [],
    notes = '',
    capo,
    memorized,
    transpose,
  } = req.body;
  const createdAt = new Date().toISOString();
  const lastUpdated = createdAt;
  const tagString = JSON.stringify(tags);

  db.run(
    `INSERT INTO projects (title, artist, chordsUrl, tags, notes, capo, memorized, transpose, createdAt, lastUpdated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      artist,
      chordsUrl,
      tagString,
      notes,
      capo,
      memorized,
      transpose,
      createdAt,
      lastUpdated,
    ],
    function (err) {
      if (err) {
        console.error('Error inserting project:', err.message);
        return res.status(500).json({ error: 'Database insert failed' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Save practice session to a project and update lastUpdated
app.post('/api/projects/:id/practice-sessions', (req, res) => {
  const projectId = req.params.id;
  const { duration, startTime, endTime } = req.body;
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO practice_sessions (projectId, duration, startTime, endTime, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [projectId, duration, startTime, endTime, createdAt],
    function (err) {
      if (err) {
        console.error('Error saving practice session:', err.message);
        return res.status(500).json({ error: 'Failed to save session' });
      }

      // Update the parent project's lastUpdated timestamp
      db.run(
        `UPDATE projects SET lastUpdated = ? WHERE id = ?`,
        [createdAt, projectId],
        (updateErr) => {
          if (updateErr) {
            console.error('Error updating lastUpdated:', updateErr.message);
            return res
              .status(500)
              .json({ error: 'Failed to update timestamp' });
          }

          res.status(201).json({ id: this.lastID });
        }
      );
    }
  );
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;
  db.run('DELETE FROM projects WHERE id = ?', [projectId], function (err) {
    if (err) {
      console.error('Error deleting project:', err.message);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
