// backend/importCsvToDb.js

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { parseCsvToProjects } = require('./parseCsvToProjects');
const { Project } = require('./Project');

// Load and parse the CSV
const csvPath = path.join(__dirname, 'imported_songs.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');
const projects = parseCsvToProjects(csvData);

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, 'projects.db'));

db.serialize(() => {
  // Create the updated projects table (if it doesn't exist)
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT,
      chordsUrl TEXT,
      recordingUrl TEXT,
      tags TEXT,
      notes TEXT,
      capo INTEGER,
      memorized BOOLEAN,
      transpose INTEGER,
      createdAt TEXT,
      lastUpdated TEXT
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO projects (
      title, chordsUrl, recordingUrl, tags, notes, artist,
      capo, transpose, memorized, 
      createdAt, lastUpdated
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  projects.forEach((project) => {
    stmt.run(
      project.title,
      project.chordsUrl || '',
      project.recordingUrl || '',
      JSON.stringify(project.tags || []),
      project.notes || '',
      project.artist || '',
      project.capo,
      project.transpose, // transpose moved up
      project.memorized, // memorized moved down
      project.createdAt.toISOString(),
      project.lastUpdated.toISOString()
    );
  });

  stmt.finalize();
  console.log(`Imported ${projects.length} projects into the database.`);
});

db.close();
