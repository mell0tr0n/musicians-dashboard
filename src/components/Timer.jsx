// frontend/src/components/Timer.jsx

import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const Timer = ({
  isRunning,
  setIsRunning,
  onElapsedChange,
  onRunningChange,
}) => {
  const intervalRef = useRef(null);
  const elapsedRef = useRef(0); // Keep internal persistent time

  useEffect(() => {
    // Sync external consumers
    onElapsedChange?.(elapsedRef.current);
    onRunningChange?.(isRunning);
  }, [isRunning, onElapsedChange, onRunningChange]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Clean up on unmount
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(1, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const start = () => {
    if (!intervalRef.current) {
      const startTime = Date.now() - elapsedRef.current;
      intervalRef.current = setInterval(() => {
        elapsedRef.current = Date.now() - startTime;
        onElapsedChange?.(elapsedRef.current);
      }, 1000);
      setIsRunning(true);
    }
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    elapsedRef.current = 0;
    onElapsedChange?.(0);
  };

  const save = () => {
    stop();
    alert(`Saved session: ${formatTime(elapsedRef.current)}`);
    // Save logic handled by parent or future modal
  };

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2, fontFamily: 'monospace' }}>
        {formatTime(elapsedRef.current)}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ maxWidth: '100%' }}
      >
        <Button
          onClick={start}
          variant="contained"
          color="secondary"
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          onClick={stop}
          variant="contained"
          color="error"
          disabled={!isRunning}
        >
          Stop
        </Button>
        <Button onClick={reset} variant="outlined">
          Reset
        </Button>
        <Button onClick={save} variant="contained" color="success">
          Save
        </Button>
      </Stack>
    </Box>
  );
};

export default Timer;
