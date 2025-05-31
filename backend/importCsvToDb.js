// importCsvToDb.js
// One-time script to import projects from imported_songs.csv into SQLite DB

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { parseCsvToProjects } = require('./parseCsvToProjects');

const { Project } = require('./Project');

// Load CSV and parse it into Project instances
const csvPath = path.join(__dirname, 'imported_songs.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');

const projects = parseCsvToProjects(csvData);

const db = new sqlite3.Database(path.join(__dirname, 'projects.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      chordsUrl TEXT,
      tags TEXT,
      notes TEXT,
      artist TEXT,
      createdAt TEXT,
      lastUpdated TEXT
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO projects (title, chordsUrl, tags, notes, artist, createdAt, lastUpdated)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  projects.forEach((project) => {
    stmt.run(
      project.title,
      project.chordsUrl || '',
      JSON.stringify(project.tags || []),
      project.notes || '',
      project.artist || '',
      project.createdAt.toISOString(),
      project.lastUpdated.toISOString()
    );
  });

  stmt.finalize();
  console.log(`✅ Imported ${projects.length} projects into the database.`);
});

db.close();
