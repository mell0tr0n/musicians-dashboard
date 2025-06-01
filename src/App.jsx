// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  const [hoveringSidebar, setHoveringSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteTimer, setDeleteTimer] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data
          .map((p) => {
            let parsedTags = [];
            try {
              parsedTags =
                typeof p.tags === 'string'
                  ? JSON.parse(p.tags)
                  : Array.isArray(p.tags)
                  ? p.tags
                  : [];
            } catch (err) {
              console.warn(
                `Failed to parse tags for project "${p.title}":`,
                p.tags
              );
            }
            return { ...p, tags: parsedTags };
          })
          .filter((p) => p.title && p.title.trim().length > 0);
        setProjects(normalized);
      })
      .catch((err) => {
        console.error('Failed to fetch projects:', err);
      });
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
      })
      .catch((err) => console.error('Failed to add project:', err));
  };

  const handleUpdateProject = (index, updatedData) => {
    const existing = projects[index];
    const updated = {
      ...existing,
      ...updatedData,
      tags: JSON.stringify(updatedData.tags || []),
      lastUpdated: new Date().toISOString(),
    };

    fetch(`http://localhost:3001/api/projects/${existing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then(() => {
        const updatedProjects = [...projects];
        updatedProjects[index] = {
          ...updated,
          tags: updatedData.tags || [],
        };
        setProjects(updatedProjects);
        setSelectedProject(updatedProjects[index]);
        setIsEditing(false);
      })
      .catch((err) => console.error('Failed to update project:', err));
  };

  const confirmDeleteProject = (index) => {
    setConfirmDeleteIndex(index);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const index = confirmDeleteIndex;
    const project = projects[index];
    const updated = projects.filter((_, i) => i !== index);

    setProjects(updated);
    setSelectedProject(null);
    setSelectedIndex(null);
    setPendingDelete(project);
    setSnackbarOpen(true);
    setConfirmDialogOpen(false);

    const timer = setTimeout(() => {
      fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Failed to delete project:', err));
      setPendingDelete(null);
    }, 5000);

    setDeleteTimer(timer);
  };

  const handleUndoDelete = () => {
    if (deleteTimer) clearTimeout(deleteTimer);
    if (pendingDelete) {
      setProjects((prev) => [pendingDelete, ...prev]);
    }
    setPendingDelete(null);
    setSnackbarOpen(false);
  };

  const handleEditProject = () => {
    setIsEditing(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        onMouseEnter={() => setHoveringSidebar(true)}
        onMouseLeave={() => setHoveringSidebar(false)}
        sx={{
          width: sidebarOpen ? '280px' : '0',
          minWidth: sidebarOpen ? '280px' : '0',
          maxWidth: sidebarOpen ? '280px' : '0',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          borderRight: sidebarOpen ? '1px solid #ddd' : 'none',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        {/* Vertically centered sidebar collapse carat */}
        {sidebarOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRight: 'none',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <IconButton onClick={() => setSidebarOpen(false)} size="small">
              <ChevronLeft />
            </IconButton>
          </Box>
        )}

        {/* Timer Toolbar + Add Button + Project List */}
        <TimerToolbar />

        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flexShrink: 0,
            backgroundColor: '#fff',
            zIndex: 1,
          }}
        >
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
          >
            Add New Project
          </Button>
        </Box>

        <Divider />

        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          <ProjectList
            projects={projects.filter((p) => {
              const text = `${p.title} ${p.artist}`.toLowerCase();
              return text.includes(searchTerm.toLowerCase());
            })}
            onSelect={(project, index) => {
              setSelectedProject(project);
              setSelectedIndex(index);
              setIsAdding(false);
              setIsEditing(false);
            }}
            selectedIndex={selectedIndex}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>
      </Box>

      {/* Sidebar collapsed view */}
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

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {isAdding ? (
            <ProjectForm
              mode="add"
              onSave={handleAddProject}
              onCancel={() => setIsAdding(false)}
            />
          ) : isEditing ? (
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
              onEdit={handleEditProject}
              onDelete={confirmDeleteProject}
            />
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
              Select a project to view details.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? You can undo this
            within a few seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Undo Snackbar */}
      <Snackbar
        open={snackbarOpen}
        message="Project deleted"
        action={
          <Button color="secondary" size="small" onClick={handleUndoDelete}>
            UNDO
          </Button>
        }
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default App;
