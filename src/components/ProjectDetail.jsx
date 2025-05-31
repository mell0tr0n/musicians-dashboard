// src/components/ProjectDetail.jsx

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
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ProjectForm from './ProjectForm';

const ProjectDetail = ({ project, index, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [sessionsExpanded, setSessionsExpanded] = useState(false);

  if (!project) return null;

  return (
    <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
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
          <Typography variant="h4">{project.title}</Typography>

          {project.chordsUrl && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Chords / Lyrics
              </Typography>
              <Link
                href={project.chordsUrl}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ wordBreak: 'break-word', color: 'primary.main' }}
              >
                {project.chordsUrl}
              </Link>
            </Box>
          )}

          {project.tags?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.tags.map((tag, i) => (
                  <Chip key={i} label={tag} />
                ))}
              </Box>
            </Box>
          )}

          {project.notes && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {project.notes}
              </Typography>
            </Box>
          )}

          {project.practiceSessions?.length > 0 && (
            <Box mb={3}>
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
                Practice Sessions ({project.practiceSessions.length})
                {sessionsExpanded ? <ExpandLess /> : <ExpandMore />}
              </Typography>

              <Collapse in={sessionsExpanded} timeout="auto" unmountOnExit>
                <List dense>
                  {project.practiceSessions.map((session, i) => {
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

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(index)}
            >
              Delete
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProjectDetail;
