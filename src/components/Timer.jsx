// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const Timer = ({ onStop }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  const start = () => {
    if (!isRunning) {
      const startTime = Date.now() - elapsed;
      const id = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
      if (onStop) onStop(elapsed);
    }
  };

  const reset = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setElapsed(0);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  return (
    <Box
      sx={{
        p: 3,
        m: '2rem auto',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '12px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Practice Timer
      </Typography>

      <Typography variant="h3" sx={{ my: 2 }}>
        {formatTime(elapsed)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          onClick={start}
          disabled={isRunning}
          color="primary"
        >
          Start
        </Button>
        <Button
          variant="contained"
          onClick={stop}
          disabled={!isRunning}
          color="secondary"
        >
          Stop
        </Button>
        <Button variant="outlined" onClick={reset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Timer;
