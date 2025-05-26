// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';

import Timer from './components/Timer';
import ProjectList from './components/ProjectList';
import { Project } from './models/Project';

const LOCAL_STORAGE_KEY = 'projects';

const App = () => {
  /** ----------------------------------------------------------------
   *  Project state & persistence
   *  ---------------------------------------------------------------- */
  const [projects, setProjects] = useState([]);

  // Load projects on first mount; add mock data if empty
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    let loaded = stored.map(Project.fromJSON);

    if (loaded.length === 0) {
      // Seed mock projects for testing
      loaded = [
        new Project('Test 1', '', ['tag 1'], 'Note 1'),
        new Project('Test 2', '', ['tag 2'], 'Note 2'),
        new Project('Test 3', '', ['tag 3'], 'Note 3'),
      ];
    }

    setProjects(loaded);
  }, []);

  // Persist whenever projects change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(projects.map((p) => p.toJSON()))
    );
  }, [projects]);

  /** ----------------------------------------------------------------
   *  Helper: add a project (returns the existing or new Project obj)
   *  ---------------------------------------------------------------- */
  const addProject = (title) => {
    const existing = projects.find(
      (p) => p.title.toLowerCase() === title.toLowerCase()
    );
    if (existing) return existing;

    const newProj = new Project(title);
    setProjects([newProj, ...projects]);
    return newProj;
  };

  /** ----------------------------------------------------------------
   *  Handler for Timer save
   *  ---------------------------------------------------------------- */
  const handleTimerSave = ({ duration, title }) => {
  let updated = [...projects];
  let project = updated.find(
    (p) => p.title.toLowerCase() === title.toLowerCase()
  );

  if (!project) {
    project = new Project(title);
    project.addPracticeDuration(duration);
    updated = [project, ...updated];
  } else {
    project.addPracticeDuration(duration);
  }

  setProjects(updated);
  console.log(
    `Saved ${duration}ms to project “${project.title}” (total: ${project.totalDuration}ms)`
  );
};


  /** ----------------------------------------------------------------
   *  Render
   *  ---------------------------------------------------------------- */
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Musician’s Dashboard
      </Typography>

      {/* Timer receives current project titles */}
      <Timer projects={projects} onSave={handleTimerSave} />

      {/* ProjectList manages its own add/edit/delete UI */}
      <ProjectList
        /* key forces re-mount when project count changes so the list refreshes */
        key={projects.length}
      />
    </Container>
  );
};

export default App;
