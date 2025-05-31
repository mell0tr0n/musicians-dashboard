import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const Timer = ({ onSave, projects = [] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  const handleStart = () => {
    if (!isRunning) {
      const id = setInterval(() => {
        setElapsed((prev) => prev + 1000);
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setElapsed(0);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(elapsed);
    }
    handleReset();
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        Practice Timer
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          fontFamily: 'monospace',
          color: 'text.primary',
        }}
      >
        {formatTime(elapsed)}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          onClick={handleStart}
          disabled={isRunning}
          sx={{
            backgroundColor: '#4B1248',
            '&:hover': { backgroundColor: '#3b0f3a' },
          }}
        >
          Start
        </Button>

        <Button
          variant="contained"
          onClick={handleStop}
          disabled={!isRunning}
          sx={{
            backgroundColor: '#e0e0e0',
            color: '#666',
            '&:hover': { backgroundColor: '#d5d5d5' },
          }}
        >
          Stop
        </Button>

        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            color: '#4B1248',
            borderColor: '#4B1248',
            '&:hover': {
              borderColor: '#3b0f3a',
              backgroundColor: '#f5f0f7',
            },
          }}
        >
          Reset
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#4EB5AD',
            '&:hover': { backgroundColor: '#3da39a' },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Timer;
