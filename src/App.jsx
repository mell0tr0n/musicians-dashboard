// src/App.jsx

import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ProjectList from './components/ProjectList';
import { Project } from './models/Project';
import { PracticeSession } from './models/PracticeSession';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { CssBaseline, Typography, Box, Paper } from '@mui/material';

import { mockProjects } from './data/mockProjects';

const LOCAL_STORAGE_KEY = 'projects';

const App = () => {
  const [projects, setProjects] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const loaded = stored.map(Project.fromJSON);
    setProjects(loaded);
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
      const updated = [...prevProjects];
      const existing = updated.find(
        (p) => p.title.toLowerCase() === title.toLowerCase()
      );

      if (existing) {
        existing.addPracticeSession(session);
      } else {
        const newProject = new Project(title);
        newProject.addPracticeSession(session);
        updated.unshift(newProject);
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updated.map((p) => p.toJSON()))
      );

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
