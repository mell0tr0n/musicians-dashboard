import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Link,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { ExpandLess, ExpandMore, MoreVert } from '@mui/icons-material';
import ProjectForm from './ProjectForm';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
};

const ProjectDetail = ({ project, index, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [sessionsExpanded, setSessionsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  if (!project) return null;

  const {
    title,
    artist,
    chordsUrl,
    notes,
    tags,
    practiceSessions,
    createdAt,
    lastUpdated,
    ...rest
  } = project;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditMode(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this project?')) {
      onDelete(index);
    }
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '640px',
        minWidth: '640px',
        minHeight: 'calc(100vh - 64px - 48px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      {/* Settings Icon */}
      {!editMode && (
        <>
          <IconButton
            aria-label="Project options"
            onClick={handleMenuClick}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete
            </MenuItem>
          </Menu>
        </>
      )}

      {editMode ? (
        <ProjectForm
          mode="edit"
          initialData={project}
          onSave={(updatedData) => {
            onUpdate(index, updatedData);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <>
          {/* Title + Artist */}
          <Typography variant="h4" sx={{ mb: 1 }}>
            {title}
            {artist && (
              <Typography
                component="span"
                variant="h5"
                sx={{ fontWeight: 400, ml: 1 }}
              >
                by{' '}
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {artist}
                </Box>
              </Typography>
            )}
          </Typography>

          {/* Chords / Lyrics */}
          {chordsUrl && (
            <Box mb={3} minHeight="4rem">
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Chords / Lyrics
              </Typography>
              <Link
                href={chordsUrl}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{
                  fontSize: '1rem',
                  color: 'primary.main',
                  wordBreak: 'break-word',
                }}
              >
                {chordsUrl}
              </Link>
            </Box>
          )}

          {/* Practice Sessions */}
          {practiceSessions?.length > 0 && (
            <Box mb={3} minHeight="5rem">
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setSessionsExpanded(!sessionsExpanded)}
              >
                Practice Sessions ({practiceSessions.length})
                {sessionsExpanded ? <ExpandLess /> : <ExpandMore />}
              </Typography>
              <Collapse in={sessionsExpanded} timeout="auto" unmountOnExit>
                <List dense>
                  {practiceSessions.map((session, i) => {
                    const date = new Date(
                      session.startTime
                    ).toLocaleDateString();
                    const formattedTime = new Date(session.duration)
                      .toISOString()
                      .substr(11, 8);
                    return (
                      <ListItem key={i}>
                        <ListItemText primary={`${date} — ${formattedTime}`} />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <Box mb={3} minHeight="3rem">
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, i) => (
                  <Chip key={i} label={tag} />
                ))}
              </Box>
            </Box>
          )}

          {/* Notes */}
          {notes && (
            <Box mb={3} minHeight="3rem">
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {notes}
              </Typography>
            </Box>
          )}

          {/* Created / Updated timestamps */}
          {createdAt && (
            <Box mb={1}>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(createdAt)}
              </Typography>
            </Box>
          )}
          {lastUpdated && (
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(lastUpdated)}
              </Typography>
            </Box>
          )}

          {/* Any other remaining fields */}
          {Object.entries(rest).map(([key, value]) => {
            if (!value || Array.isArray(value)) return null;
            return (
              <Box key={key} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {key}
                </Typography>
                <Typography variant="body2">{String(value)}</Typography>
              </Box>
            );
          })}

          <Divider sx={{ mb: 3 }} />
        </>
      )}
    </Box>
  );
};

export default ProjectDetail;
