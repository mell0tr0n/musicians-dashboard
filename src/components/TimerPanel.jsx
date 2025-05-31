import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Timer from './Timer'; // uses your existing Timer.jsx logic

const TimerPanel = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        mb: 4,
        mx: 'auto',
        maxWidth: '500px',
        backgroundColor: '#fefefe',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h5" align="center" fontWeight="bold" sx={{ mb: 2 }}>
        Practice Timer
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Timer />
      </Box>
    </Paper>
  );
};

export default TimerPanel;
