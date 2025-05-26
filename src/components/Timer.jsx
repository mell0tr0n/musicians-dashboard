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

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  const handleSaveClick = () => {
    if (elapsed > 0) {
      setDialogOpen(true);
    } else {
      alert('You must run the timer before saving.');
    }
  };

  const handleConfirmSave = () => {
    const title = newProject.trim() || selectedProject;
    if (!title) {
      alert('Please enter or select a project name.');
      return;
    }
    if (onSave) {
      onSave({ duration: elapsed, title });
    }
    setDialogOpen(false);
    setNewProject('');
    setSelectedProject('');
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

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
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
            label="Select Existing Project"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setNewProject('');
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">-- None --</MenuItem>
            {projects.map((proj, i) => (
              <MenuItem key={i} value={proj.title}>
                {proj.title}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Or Enter New Project Name"
            value={newProject}
            onChange={(e) => {
              setNewProject(e.target.value);
              setSelectedProject('');
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timer;
