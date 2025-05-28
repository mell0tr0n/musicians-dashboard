// src/App.jsx

import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ProjectList from './components/ProjectList';
import { Project } from './models/Project';
import { PracticeSession } from './models/PracticeSession';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { CssBaseline, Typography, Box, Paper } from '@mui/material';
//import MainLayout from './layouts/MainLayout';

const LOCAL_STORAGE_KEY = 'projects';

// Mock project data
const mockProjects = () => {
  const p1 = new Project('Finger Exercises', '', ['warm-up'], 'Basic warmups');
  p1.addPracticeSession(new PracticeSession('Finger Exercises', [], 60000));
  p1.addPracticeSession(new PracticeSession('Finger Exercises', [], 120000));

  const p2 = new Project('Jazz Standards', '', ['jazz'], 'Working on phrasing');
  p2.addPracticeSession(new PracticeSession('Jazz Standards', [], 90000));

  const p3 = new Project('Original Song', '', ['composition'], 'Wrote chorus!');
  p3.addPracticeSession(new PracticeSession('Original Song', [], 180000));

  return [p1, p2, p3];
};

const App = () => {
  const [projects, setProjects] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

    if (stored.length === 0) {
      const mock = mockProjects();
      setProjects(mock);
    } else {
      const loaded = stored.map(Project.fromJSON);
      setProjects(loaded);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(projects.map((p) => p.toJSON()))
    );
  }, [projects]);

  // When a practice session is saved from the timer
  const handleSaveSession = ({ title, duration }) => {
    const session = new PracticeSession(title, [], duration);

    setProjects((prevProjects) => {
      const updated = prevProjects.map((project) => {
        if (project.title.toLowerCase() === title.toLowerCase()) {
          // Return a new project object with updated practiceSessions
          const newProject = Project.fromJSON(project.toJSON()); // clone safely
          newProject.addPracticeSession(session);
          return newProject;
        }
        return project;
      });

      const found = updated.find(
        (p) => p.title.toLowerCase() === title.toLowerCase()
      );

      if (!found) {
        const newProject = new Project(title);
        newProject.addPracticeSession(session);
        return [newProject, ...updated];
      }

      return updated;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Musician’s Dashboard
        </Typography>

        <Paper elevation={3} sx={{ p: 3, my: 3 }}>
          <Timer onSave={handleSaveSession} projects={projects} />
        </Paper>

        <Paper
          elevation={3}
          sx={{
            px: 5,
            py: 1,
            my: 0,
          }}
        >
          <ProjectList projects={projects} setProjects={setProjects} />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default App;
