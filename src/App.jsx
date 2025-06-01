import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import TimerPanel from './components/TimerPanel';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveringSidebar, setHoveringSidebar] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects from the backend
  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data
          .map((p) => ({
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
          }))
          .filter((p) => p.title && p.title.trim().length > 0); // ✅ ignore blanks
        //test projects with no title
        console.log(
          'Projects with missing title:',
          data.filter((p) => !p.title || p.title.trim() === '')
        );

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
        const saved = { ...newProject, id: result.id };
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
      lastUpdated: new Date().toISOString(),
    };

    fetch(`http://localhost:3001/api/projects/${existing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then(() => {
        const updatedProjects = [...projects];
        updatedProjects[index] = updated;
        setProjects(updatedProjects);
        setSelectedProject(updated);
      })
      .catch((err) => console.error('Failed to update project:', err));
  };

  const handleDeleteProject = (index) => {
    const project = projects[index];
    if (!window.confirm('Delete this project?')) return;

    fetch(`http://localhost:3001/api/projects/${project.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updated = projects.filter((_, i) => i !== index);
        setProjects(updated);
        setSelectedProject(null);
        setSelectedIndex(null);
      })
      .catch((err) => console.error('Failed to delete project:', err));
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
        {/* Collapse Button */}
        {sidebarOpen && hoveringSidebar && (
          <IconButton
            onClick={() => setSidebarOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              '&:hover': { backgroundColor: 'rgba(240, 240, 240, 0.95)' },
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        {sidebarOpen && (
          <>
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
                  setSelectedProject(null);
                  setSelectedIndex(null);
                }}
              >
                Add New Project
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setShowTimer((prev) => !prev)}
              >
                {showTimer ? 'Hide Timer' : 'Show Timer'}
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
                }}
                selectedIndex={selectedIndex}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </Box>
          </>
        )}
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
        {showTimer && <TimerPanel />}

        {isAdding ? (
          <ProjectForm
            mode="add"
            onSave={handleAddProject}
            onCancel={() => setIsAdding(false)}
          />
        ) : selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            index={selectedIndex}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            Select a project to view details.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default App;
