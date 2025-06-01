// frontend/src/components/TimerToolbar.jsx

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faPlay,
  faPause,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

const TimerToolbar = () => {
  const [displayMode, setDisplayMode] = useState('mini');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [notes, setNotes] = useState('');

  const dummyProjects = [
    { id: 1, title: 'What’s Up' },
    { id: 2, title: 'The Barrel' },
    { id: 3, title: 'Rooster' },
  ];

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
        const newElapsed = Date.now() - startTime;
        setElapsed(newElapsed);
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
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    console.log('Saved:', {
      duration: formatTime(elapsed),
      project: selectedProject,
      notes,
    });
    setSaveDialogOpen(false);
    setElapsed(0);
    setNotes('');
    setSelectedProject('');
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
                sx={{
                  p: 0.5,
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
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
            {/* Timer icon (click to hide) */}
            <Tooltip title="Hide Timer">
              <IconButton
                onClick={() => setDisplayMode('hidden')}
                size="small"
                sx={{
                  p: 0.5,
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <FontAwesomeIcon icon={faClock} size="lg" />
              </IconButton>
            </Tooltip>

            {/* Timer display */}
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

            {/* Play / Pause */}
            <Tooltip title={isRunning ? 'Pause' : 'Play'}>
              <IconButton
                onClick={toggleRunning}
                size="small"
                color={isRunning ? 'error' : 'primary'}
                sx={{
                  p: 0.5,
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <FontAwesomeIcon
                  icon={isRunning ? faPause : faPlay}
                  size="lg"
                />
              </IconButton>
            </Tooltip>

            {/* Save */}
            <Tooltip title="Save Session">
              <IconButton
                onClick={handleSave}
                size="small"
                sx={{
                  p: 0.5,
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <FontAwesomeIcon icon={faFloppyDisk} size="lg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
      )}

      {/* Save Session Modal */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Save Practice Session</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Select Project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            fullWidth
          >
            {dummyProjects.map((proj) => (
              <MenuItem key={proj.id} value={proj.title}>
                {proj.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Notes (optional)"
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TimerToolbar;
