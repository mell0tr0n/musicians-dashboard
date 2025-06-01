// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import TimerToolbar from './components/TimerToolbar';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isSaveMode, setIsSaveMode] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [deletedProject, setDeletedProject] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((p) => ({
          ...p,
          tags:
            typeof p.tags === 'string'
              ? JSON.parse(p.tags)
              : Array.isArray(p.tags)
              ? p.tags
              : [],
        }));
        setProjects(normalized);
      })
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  const handleAddProject = (data) => {
    const now = new Date().toISOString();
    const newProject = {
      ...data,
      tags: JSON.stringify(data.tags || []),
      createdAt: now,
      lastUpdated: now,
    };

    fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    })
      .then((res) => res.json())
      .then((result) => {
        const saved = {
          ...newProject,
          id: result.id,
          tags: data.tags || [],
        };

        setProjects((prev) => [saved, ...prev]);
        setSelectedProject(saved);
        setSelectedIndex(0);
        setIsAdding(false);

        if (isSaveMode && pendingSession) {
          const sessionToSend = {
            ...pendingSession,
            tags: JSON.stringify(pendingSession.tags || []),
          };

          fetch(
            `http://localhost:3001/api/projects/${saved.id}/practice-sessions`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(sessionToSend),
            }
          )
            .then((res) => {
              if (!res.ok) throw new Error('Save failed');
              return res.json();
            })
            .then(() => {
              setSnackbarOpen(true);
            })
            .catch((err) => {
              console.error('Failed to save session:', err);
              alert('Save failed.');
            })
            .finally(() => {
              setIsSaveMode(false);
              setPendingSession(null);
            });
        } else {
          setIsSaveMode(false);
          setPendingSession(null);
        }
      });
  };

  const handleRequestSaveToProject = (session) => {
    setIsSaveMode(true);
    setPendingSession({
      ...session,
      label: session.label || '',
      tags: session.tags || [],
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleSaveToProject = (project) => {
    if (!pendingSession) return;

    const sessionToSend = {
      ...pendingSession,
      tags: JSON.stringify(pendingSession.tags || []),
    };

    fetch(
      `http://localhost:3001/api/projects/${project.id}/practice-sessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionToSend),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(() => {
        setSnackbarOpen(true);
        const index = projects.findIndex((p) => p.id === project.id);
        if (index !== -1) {
          setSelectedProject(project);
          setSelectedIndex(index);
        }
      })
      .catch((err) => {
        console.error('Failed to save session:', err);
        alert('Save failed.');
      })
      .finally(() => {
        setIsSaveMode(false);
        setPendingSession(null);
      });
  };

  const handleDeleteProject = (index) => {
    const projectToDelete = projects[index];
    if (!projectToDelete) return;

    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
    setSelectedProject(null);
    setSelectedIndex(null);

    setDeletedProject({ project: projectToDelete, index });

    const timeout = setTimeout(() => {
      fetch(`http://localhost:3001/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      }).catch((err) => {
        console.error('Failed to delete from DB:', err);
      });
      setDeletedProject(null);
      setUndoTimeout(null);
    }, 5000);

    setUndoTimeout(timeout);
    setSnackbarOpen(true);
  };

  const handleUndoDelete = () => {
    if (!deletedProject) return;

    clearTimeout(undoTimeout);

    const restored = [...projects];
    restored.splice(deletedProject.index, 0, deletedProject.project);
    setProjects(restored);

    setDeletedProject(null);
    setUndoTimeout(null);
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          width: sidebarOpen ? '280px' : '0',
          minWidth: sidebarOpen ? '280px' : '0',
          maxWidth: sidebarOpen ? '280px' : '0',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          borderRight: sidebarOpen ? '1px solid #ddd' : 'none',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        <TimerToolbar onRequestSaveToProject={handleRequestSaveToProject} />

        <Box
          sx={{
            p: 2,
            border: isSaveMode ? '3px solid #1976d2' : 'none',
            borderRadius: 2,
            backgroundColor: isSaveMode ? '#e3f2fd' : 'transparent',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isSaveMode && (
            <Alert
              severity="info"
              variant="outlined"
              sx={{ mb: 2, fontSize: '0.875rem' }}
            >
              Select a project to save this session to, or use “Add New Project”
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setIsAdding(true);
              setIsEditing(false);
              setSelectedProject(null);
              setSelectedIndex(null);
            }}
            sx={{ mb: 2 }}
          >
            Add New Project
          </Button>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
            <ProjectList
              projects={projects.filter((p) =>
                `${p.title} ${p.artist}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )}
              onSelect={(project, index) => {
                if (isSaveMode) {
                  handleSaveToProject(project);
                } else {
                  setSelectedProject(project);
                  setSelectedIndex(index);
                  setIsAdding(false);
                  setIsEditing(false);
                }
              }}
              onSaveToProject={isSaveMode ? handleSaveToProject : null}
              selectedIndex={selectedIndex}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Box>
        </Box>
      </Box>

      {!sidebarOpen && (
        <Box
          sx={{
            width: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pt: 2,
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #ddd',
          }}
        >
          <IconButton onClick={() => setSidebarOpen(true)}>
            <ChevronRight />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
          {isAdding ? (
            <Box
              sx={{
                p: 3,
                border: isSaveMode ? '3px solid #1976d2' : 'none',
                borderRadius: 2,
                backgroundColor: isSaveMode ? '#e3f2fd' : 'transparent',
              }}
            >
              <ProjectForm
                mode="add"
                onSave={handleAddProject}
                onCancel={() => setIsAdding(false)}
              />
              {isSaveMode && pendingSession && (
                <Box
                  sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    borderTop: '1px solid #ccc',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Practice Sessions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(pendingSession.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {Math.floor(pendingSession.duration / 60000)}m{' '}
                    {Math.floor((pendingSession.duration % 60000) / 1000)}s
                  </Typography>
                </Box>
              )}
            </Box>
          ) : isEditing && selectedProject ? (
            <ProjectForm
              mode="edit"
              initialData={selectedProject}
              onSave={(updated) => handleUpdateProject(selectedIndex, updated)}
              onCancel={() => setIsEditing(false)}
            />
          ) : selectedProject ? (
            <ProjectDetail
              project={selectedProject}
              index={selectedIndex}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeleteProject}
            />
          ) : (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              Select a project to view details.
            </Typography>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Project deleted"
        action={
          deletedProject && (
            <Button color="secondary" size="small" onClick={handleUndoDelete}>
              UNDO
            </Button>
          )
        }
        autoHideDuration={5000}
      />
    </Box>
  );
};

export default App;
