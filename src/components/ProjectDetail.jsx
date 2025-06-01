// frontend/src/components/ProjectDetail.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Link,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(isoString).toLocaleDateString(undefined, options);
};

const formatDuration = (ms) => {
  if (!ms) return '—';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
};

const ProjectDetail = ({ project, index, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!project?.id) return;

    fetch(`http://localhost:3001/api/projects/${project.id}/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error('Failed to fetch sessions:', err));
  }, [project]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              onEdit(index);
              setAnchorEl(null);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(index);
              setAnchorEl(null);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {project.artist && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {project.artist}
        </Typography>
      )}

      <Typography variant="body2" gutterBottom>
        <strong>Technical Info:</strong>
        <br />
        Capo: {project.capo ?? '—'} &nbsp;&nbsp; Transpose:{' '}
        {project.transpose ?? '—'} &nbsp;&nbsp; Memorized:{' '}
        {project.memorized ? 'Yes' : '—'}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Links:</strong>
        <br />
        Chords:{' '}
        {project.chordsUrl ? (
          <Link
            href={project.chordsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.chordsUrl}
          </Link>
        ) : (
          '—'
        )}
        <br />
        Recording:{' '}
        {project.recordingUrl ? (
          <Link
            href={project.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.recordingUrl}
          </Link>
        ) : (
          '—'
        )}
      </Typography>

      {project.tags?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <strong>Tags:</strong>
          <br />
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {project.tags.map((tag, i) => (
              <Chip key={i} label={tag} size="small" />
            ))}
          </Stack>
        </Box>
      )}

      {project.notes && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            <strong>Notes:</strong>
            <br />
            {project.notes}
          </Typography>
        </Box>
      )}

      {/* === Practice Sessions === */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Practice Sessions
      </Typography>

      {sessions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No practice sessions recorded.
        </Typography>
      ) : (
        <List dense>
          {sessions.map((session, i) => (
            <ListItem key={i} disablePadding>
              <ListItemText
                primary={formatDate(session.createdAt)}
                secondary={formatDuration(session.duration)}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ProjectDetail;
