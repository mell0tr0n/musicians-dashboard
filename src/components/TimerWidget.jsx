// components/TimerWidget.jsx

import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Timer from './Timer';

const TimerWidget = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        mb: 3,
        px: 2,
        pt: 2,
        pb: collapsed ? 1 : 2,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: collapsed ? 0 : 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon />
          <Typography variant="h6" fontWeight="bold">
            Practice Timer
          </Typography>
          {isRunning && (
            <Chip
              size="small"
              label="Running"
              color="success"
              variant="outlined"
              sx={{ fontSize: '0.75rem', height: '20px' }}
            />
          )}
        </Box>

        <Tooltip title={collapsed ? 'Show Timer' : 'Hide Timer'}>
          <IconButton onClick={handleToggle}>
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={!collapsed}>
        <Timer onRunningChange={setIsRunning} />
      </Collapse>
    </Paper>
  );
};

export default TimerWidget;
