// backend/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'projects.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
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

  db.run(`
    CREATE TABLE IF NOT EXISTS practice_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER,
      title TEXT,
      tags TEXT,
      duration INTEGER,
      startTime TEXT,
      endTime TEXT,
      label TEXT,
      createdAt TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
