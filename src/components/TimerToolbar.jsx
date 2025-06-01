// frontend/src/components/TimerToolbar.jsx

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faPlay,
  faPause,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

const TimerToolbar = ({ onRequestSaveToProject }) => {
  const [displayMode, setDisplayMode] = useState('mini');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

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

  const startTimer = () => {
    if (!intervalRef.current) {
      const startTime = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const toggleRunning = () => {
    isRunning ? stopTimer() : startTimer();
  };

  const handleSave = () => {
    stopTimer();

    const sessionData = {
      title: 'Untitled Session',
      tags: [],
      duration: elapsed,
      startTime: new Date(Date.now() - elapsed).toISOString(),
      endTime: new Date().toISOString(),
      label: '',
      createdAt: new Date().toISOString(),
    };

    if (onRequestSaveToProject) {
      onRequestSaveToProject(sessionData);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        height: '64px',
        px: 1,
        py: 1,
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fefefe',
        boxShadow: 'none',
        borderRadius: 0,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Hidden View */}
      {displayMode === 'hidden' && (
        <Fade in>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Tooltip title="Show Timer">
              <IconButton
                onClick={() => setDisplayMode('mini')}
                size="small"
                sx={{ p: 0.5 }}
              >
                <FontAwesomeIcon icon={faClock} size="lg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
      )}

      {/* Mini View */}
      {displayMode === 'mini' && (
        <Fade in>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              gap: 1.5,
              width: '100%',
              height: '100%',
              px: 1,
              overflowX: 'hidden',
            }}
          >
            <Tooltip title="Hide Timer">
              <IconButton onClick={() => setDisplayMode('hidden')} size="small">
                <FontAwesomeIcon icon={faClock} size="lg" />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                backgroundColor: '#f1f1f1',
                borderRadius: '6px',
                px: 1.5,
                py: 0.5,
                minWidth: '90px',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '1.6rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatTime(elapsed)}
              </Typography>
            </Box>

            <Tooltip title={isRunning ? 'Pause' : 'Play'}>
              <IconButton
                onClick={toggleRunning}
                size="small"
                color={isRunning ? 'error' : 'primary'}
              >
                <FontAwesomeIcon
                  icon={isRunning ? faPause : faPlay}
                  size="lg"
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Save Session">
              <IconButton onClick={handleSave} size="small">
                <FontAwesomeIcon icon={faFloppyDisk} size="lg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
      )}
    </Paper>
  );
};

export default TimerToolbar;
