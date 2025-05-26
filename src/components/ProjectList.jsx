import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Project } from '../models/Project';

const LOCAL_STORAGE_KEY = 'projects';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Form values
  const [title, setTitle] = useState('');
  const [chordsUrl, setChordsUrl] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  // Edit form
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const loaded = stored.map(Project.fromJSON);
    setProjects(loaded);
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects.map(p => p.toJSON())));
  }, [projects]);

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
      setTitleError("Title is required.");
      valid = false;
    } else if (projects.some(p => p.title.toLowerCase() === title.trim().toLowerCase())) {
      setTitleError("A project with this title already exists.");
      valid = false;
    } else {
      setTitleError('');
    }

    if (chordsUrl.trim() && !isValidHttpUrl(chordsUrl.trim())) {
      setUrlError("Please enter a valid URL.");
      valid = false;
    } else {
      setUrlError('');
    }

    if (!valid) return;

    const newProject = new Project(
      title.trim(),
      chordsUrl.trim(),
      tags.split(',').map(t => t.trim()).filter(Boolean),
      notes.trim()
    );

    setProjects([newProject, ...projects]);
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
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      notes: editNotes.trim(),
    });
    setProjects(updated);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this project?")) return;
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setExpandedIndex(null);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Your Projects
      </Typography>

      <List sx={{ mb: 2 }}>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleExpand(index)}>
                <ListItemText primary={project.title} />
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
                      <Button variant="outlined" onClick={() => setEditIndex(null)}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total Practice Time:</strong>{' '}
                      {Math.floor(project.totalDuration / 60000)} minutes
                    </Typography>
                    {project.notes && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Notes:</strong> {project.notes}
                      </Typography>
                    )}
                    {project.tags.length > 0 && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Tags:</strong> {project.tags.join(', ')}
                      </Typography>
                    )}
                    {project.chordsUrl && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Chords/Lyrics:</strong>{' '}
                        <Link href={project.chordsUrl} target="_blank" rel="noopener">
                          {project.chordsUrl}
                        </Link>
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button variant="outlined" onClick={() => handleEdit(index)} size="small">
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? 'Cancel' : 'Add New Project'}
      </Button>

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
          <Button variant="contained" onClick={handleAddProject}>
            Save Project
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ProjectList;
