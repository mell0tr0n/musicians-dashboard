import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
  Link,
  Chip,
  Button,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Project } from '../models/Project';
import ProjectForm from './ProjectForm';

const ProjectList = ({ projects, setProjects }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sessionsVisible, setSessionsVisible] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

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
      <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 3 }}>
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
                  <ProjectForm
                    mode="edit"
                    initialData={project}
                    onSave={(data) => {
                      const updated = [...projects];
                      updated[index].update(data);
                      setProjects(updated);
                      setEditIndex(null);
                    }}
                    onCancel={() => setEditIndex(null)}
                  />
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

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setEditIndex(index)}
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
                color: 'secondary.main',
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
        <ProjectForm
          mode="add"
          onSave={(data) => {
            const newProject = new Project(
              data.title,
              data.chordsUrl,
              data.tags,
              data.notes
            );
            setProjects([newProject, ...projects]);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Collapse>
    </Box>
  );
};

export default ProjectList;
