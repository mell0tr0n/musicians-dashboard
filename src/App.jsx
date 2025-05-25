import React from 'react';
import Timer from './components/Timer';
import { Container, Typography } from '@mui/material';

const App = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Musician's Dashboard
      </Typography>
      <Timer onStop={(ms) => console.log(`Timer stopped at ${ms} ms`)} />
    </Container>
  );
};

export default App;
