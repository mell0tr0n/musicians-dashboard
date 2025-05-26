import React from 'react';
import Timer from './components/Timer';
import { Container, Typography } from '@mui/material';
import ProjectList from './components/ProjectList';

const existingProjects = ['Etude in G', 'Scales Practice', 'Chord Drills'];

const App = () => {
  const handleSave = ({ duration, title }) => {
    console.log(`Saved session for ${title}: ${duration}ms`);
    // Future: save to localStorage or a session list
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Musician's Dashboard
      </Typography>
      <Timer onSave={handleSave} existingProjects={existingProjects} />
      <ProjectList />
    </Container>
  );
};

export default App;
