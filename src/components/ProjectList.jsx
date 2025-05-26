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

  const [title, setTitle] = useState('');
  const [chordsUrl, setChordsUrl] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const loaded = stored.map(Project.fromJSON);
    setProjects(loaded);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects.map(p => p.toJSON())));
  }, [projects]);

  const handleAddProject = () => {
    if (!title.trim()) return;
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
                {project.tags.length > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tags:</strong> {project.tags.join(', ')}
                  </Typography>
                )}
                {project.notes && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Notes:</strong> {project.notes}
                  </Typography>
                )}
                {project.chordsUrl && (
                  <Typography variant="body2">
                    <strong>Chords/Lyrics:</strong>{' '}
                    <Link href={project.chordsUrl} target="_blank" rel="noopener">
                      {project.chordsUrl}
                    </Link>
                  </Typography>
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
            fullWidth
          />
          <TextField
            label="Chords/Lyrics URL"
            value={chordsUrl}
            onChange={(e) => setChordsUrl(e.target.value)}
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
