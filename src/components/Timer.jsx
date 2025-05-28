import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { formatDuration } from '../utils/formatDuration';

const Timer = ({ onStop, onSave, projects = [] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProject, setNewProject] = useState('');

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

  const handleSaveClick = () => {
    if (elapsed > 0) {
      setDialogOpen(true);
      setSelectedProject('');
      setNewProject('');
    } else {
      alert('You must run the timer before saving.');
    }
  };

  const handleConfirmSave = () => {
    const title =
      selectedProject === '__new__' ? newProject.trim() : selectedProject;

    if (!title) {
      alert('Please enter or select a project name.');
      return;
    }

    onSave({ title, duration: elapsed });
    setDialogOpen(false);
    setSelectedProject('');
    setNewProject('');
    reset(); // optionally reset the timer after save
  };

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Practice Timer
      </Typography>

      <Typography
        variant="h3"
        sx={{ my: 2, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
      >
        {formatDuration(elapsed)}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="contained" onClick={start} disabled={isRunning}>
          Start
        </Button>
        <Button variant="contained" onClick={stop} disabled={!isRunning}>
          Stop
        </Button>
        <Button variant="outlined" onClick={reset}>
          Reset
        </Button>
        <Button variant="contained" color="success" onClick={handleSaveClick}>
          Save
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Save Practice Session</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="__new__">Create New Project</MenuItem>
            {projects.map((proj, i) => (
              <MenuItem key={i} value={proj.title}>
                {proj.title}
              </MenuItem>
            ))}
          </TextField>

          {selectedProject && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Practice Session: {new Date().toLocaleDateString()} –{' '}
              {formatDuration(elapsed)}
            </Typography>
          )}

          {selectedProject === '__new__' && (
            <TextField
              label="New Project Title"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timer;
