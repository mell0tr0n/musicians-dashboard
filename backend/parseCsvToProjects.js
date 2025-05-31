const fs = require('fs');
const path = require('path');
const { Project } = require('./Project');
const { PracticeSession } = require('./PracticeSession');

// Load the CSV file from the local filesystem
const csvFilePath = path.join(__dirname, 'imported_songs.csv');
const csvText = fs.readFileSync(csvFilePath, 'utf-8');

// Parses the CSV text and returns an array of Project instances
function parseCsvToProjects() {
  const lines = csvText.split('\n').filter((line) => line.trim() !== '');

  const projects = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [title, chordsUrl, tagsString, notes, artist] = line.split(',');

    const tags = tagsString
      ? tagsString.split(';').map((tag) => tag.trim())
      : [];

    const project = new Project(
      title?.trim() || '',
      chordsUrl?.trim() || '',
      tags,
      notes?.trim() || '',
      artist?.trim() || ''
    );

    projects.push(project);
  }

  return projects;
}

module.exports = { parseCsvToProjects };
