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
  const p1 = new Project(
    'Warrior - Yeah Yeah Yeahs',
    'https://tabs.ultimate-guitar.com/tab/yeah-yeah-yeahs/warrior-chords-393253',
    ['riff'],
    'Improvement on transition into second verse'
  );
  p1.addPracticeSession(
    new PracticeSession('Warrior - Yeah Yeah Yeahs', [], 60000)
  );
  p1.addPracticeSession(
    new PracticeSession('Warrior - Yeah Yeah Yeahs', [], 120000)
  );

  const p2 = new Project(
    'Mouth Of A Flower - Haley Heynderickx',
    'https://tabs.ultimate-guitar.com/tab/haley-heynderickx/mouth-of-a-flower-chords-5490891',
    ['plucking'],
    'Nailed down strumming and picking patterns'
  );
  p2.addPracticeSession(
    new PracticeSession('Mouth Of A Flower - Haley Heynderickx', [], 90000)
  );

  const p3 = new Project(
    'Hush Brain - Original Song',
    '',
    ['composition', 'original'],
    'Wrote chorus!'
  );
  p3.addPracticeSession(
    new PracticeSession('Hush Brain - Original Song', [], 180000)
  );

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

      <Box
        sx={{
          backgroundColor: '#7AAFB4', // Moonstone
          borderRadius: 3,
          padding: 3,
          maxWidth: '800px',
          margin: '2rem auto',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Musician’s Dashboard
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Timer onSave={handleSaveSession} projects={projects} />
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <ProjectList projects={projects} setProjects={setProjects} />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default App;
