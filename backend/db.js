// backend/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to DB file (creates it if it doesn't exist)
const dbPath = path.resolve(__dirname, 'projects.db');
const db = new sqlite3.Database(dbPath);

// Initialize the projects table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT,
      chordsUrl TEXT,
      tags TEXT,
      notes TEXT,
      createdAt TEXT,
      lastUpdated TEXT
    )
  `);
});

module.exports = db;
