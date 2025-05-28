import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
  Link,
  Chip,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Project } from '../models/Project';
import { formatDuration } from '../utils/formatDuration';

const ProjectList = ({ projects, setProjects }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sessionsVisible, setSessionsVisible] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [title, setTitle] = useState('');
  const [chordsUrl, setChordsUrl] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleAddProject = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else if (
      projects.some((p) => p.title.toLowerCase() === title.trim().toLowerCase())
    ) {
      setTitleError('A project with this title already exists.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (chordsUrl.trim() && !isValidHttpUrl(chordsUrl.trim())) {
      setUrlError('Please enter a valid URL.');
      valid = false;
    } else {
      setUrlError('');
    }

    if (!valid) return;

    const newProject = new Project(
      title.trim(),
      chordsUrl.trim(),
      tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      notes.trim()
    );

    const updated = [newProject, ...projects];
    setProjects(updated);
    setTitle('');
    setChordsUrl('');
    setTags('');
    setNotes('');
    setShowForm(false);
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setEditTitle(project.title);
    setEditUrl(project.chordsUrl);
    setEditTags(project.tags.join(', '));
    setEditNotes(project.notes);
    setEditIndex(index);
  };

  const handleSaveEdit = (index) => {
    const updated = [...projects];
    updated[index].update({
      title: editTitle.trim(),
      chordsUrl: editUrl.trim(),
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      notes: editNotes.trim(),
    });
    setProjects(updated);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (!window.confirm('Delete this project?')) return;
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setExpandedIndex(null);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ mt: 5, px: 2 }}>
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          marginBottom: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Your Projects
        </Typography>
      </Box>

      <List sx={{ mb: 2 }}>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleExpand(index)}>
                <ListItemText
                  primary={project.title}
                  primaryTypographyProps={{
                    sx: { fontSize: '1.25rem', fontWeight: 600 },
                  }}
                />
                {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <Box sx={{ px: 2, pb: 2 }}>
                {editIndex === index ? (
                  <>
                    <TextField
                      label="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Chords/Lyrics URL"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Tags (comma separated)"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Notes"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleSaveEdit(index)}
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    {project.practiceSessions.length > 0 && (
                      <>
                        <ListItem disablePadding sx={{ pl: 2 }}>
                          <ListItemButton
                            onClick={() =>
                              setSessionsVisible(
                                sessionsVisible === `${index}-sessions`
                                  ? null
                                  : `${index}-sessions`
                              )
                            }
                            sx={{ pl: 0 }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  component="span"
                                  sx={{ fontWeight: 600, fontSize: '1rem' }}
                                >
                                  Practice Sessions:{' '}
                                  <Typography
                                    component="span"
                                    sx={{ fontWeight: 400 }}
                                  >
                                    {project.practiceSessions.length}
                                  </Typography>
                                </Typography>
                              }
                            />
                            {sessionsVisible === `${index}-sessions` ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemButton>
                        </ListItem>
                        <Collapse
                          in={sessionsVisible === `${index}-sessions`}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List dense sx={{ pl: 4 }}>
                            {project.practiceSessions.map((session, i) => {
                              const date = new Date(session.startTime);
                              const formattedDate = date.toLocaleDateString();
                              const formattedTime = new Date(session.duration)
                                .toISOString()
                                .substr(11, 8);
                              return (
                                <ListItem key={i} sx={{ pl: 0 }}>
                                  <ListItemText
                                    primary={`${formattedDate} — ${formattedTime}`}
                                  />
                                </ListItem>
                              );
                            })}
                          </List>
                        </Collapse>
                      </>
                    )}

                    {project.chordsUrl && (
                      <>
                        <ListItem disablePadding sx={{ pl: 2 }}>
                          <ListItemText
                            primary="Chords / Lyrics"
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, fontSize: '1rem' },
                            }}
                          />
                        </ListItem>
                        <Box sx={{ pl: 4, pb: 1 }}>
                          <Link
                            href={project.chordsUrl}
                            target="_blank"
                            rel="noopener"
                            underline="hover"
                            sx={{
                              wordBreak: 'break-all',
                              color: 'primary.main',
                            }}
                          >
                            {project.chordsUrl}
                          </Link>
                        </Box>
                      </>
                    )}

                    {project.notes && (
                      <>
                        <ListItem disablePadding sx={{ pl: 2 }}>
                          <ListItemText
                            primary="Notes"
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, fontSize: '1rem' },
                            }}
                          />
                        </ListItem>
                        <Box sx={{ pl: 4, pb: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-line' }}
                          >
                            {project.notes}
                          </Typography>
                        </Box>
                      </>
                    )}

                    {project.tags.length > 0 && (
                      <>
                        <ListItem disablePadding sx={{ pl: 2 }}>
                          <ListItemText
                            primary="Tags"
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, fontSize: '1rem' },
                            }}
                          />
                        </ListItem>
                        <Box
                          sx={{
                            pl: 4,
                            pb: 1,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                          }}
                        >
                          {project.tags.map((tag, i) => (
                            <Chip
                              key={i}
                              label={tag}
                              size="medium"
                              color="secondary"
                              variant="filled"
                              sx={{ fontWeight: 600, fontSize: '0.9 rem' }}
                            />
                          ))}
                        </Box>
                      </>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(index)}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(index)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Collapse>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {showForm ? (
          <Button
            onClick={() => setShowForm(false)}
            sx={{
              minWidth: 0,
              padding: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'black',
              lineHeight: 1,
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'error.main',
              },
            }}
          >
            ×
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
          >
            Add New Project
          </Button>
        )}
      </Box>

      <Collapse in={showForm}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError}
            fullWidth
          />
          <TextField
            label="Chords/Lyrics URL"
            value={chordsUrl}
            onChange={(e) => setChordsUrl(e.target.value)}
            error={!!urlError}
            helperText={urlError}
            fullWidth
          />
          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />

          {/* Button Row */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddProject}
              color="primary"
            >
              Save Project
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ProjectList;
