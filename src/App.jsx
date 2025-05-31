import React, { useState } from 'react';
import { Box, Typography, Divider, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Project } from './models/Project';
import { parseCsvToProjects } from './utils/parseCsvToProjects';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import TimerPanel from './components/TimerPanel';

const App = () => {
  const [projects, setProjects] = useState(parseCsvToProjects());
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveringSidebar, setHoveringSidebar] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  const handleAddProject = (data) => {
    const newProject = new Project(
      data.title,
      data.chordsUrl,
      data.tags,
      data.notes,
      data.artist
    );
    const updated = [newProject, ...projects];
    setProjects(updated);
    setSelectedProject(newProject);
    setSelectedIndex(0);
    setIsAdding(false);
  };

  const handleUpdateProject = (index, updatedData) => {
    const updatedProjects = [...projects];
    updatedProjects[index].update(updatedData);
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects[index]);
  };

  const handleDeleteProject = (index) => {
    if (!window.confirm('Delete this project?')) return;
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setSelectedProject(null);
    setSelectedIndex(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <Box
        onMouseEnter={() => setHoveringSidebar(true)}
        onMouseLeave={() => setHoveringSidebar(false)}
        sx={{
          width: sidebarOpen ? '30%' : '0',
          minWidth: sidebarOpen ? '240px' : '0',
          maxWidth: sidebarOpen ? '300px' : '0',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
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
            <ProjectList
              projects={projects}
              onSelect={(project, index) => {
                setSelectedProject(project);
                setSelectedIndex(index);
                setIsAdding(false);
              }}
              selectedIndex={selectedIndex}
            />
            <Divider />
            <Box
              sx={{
                p: 2,
                pt: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
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
          </>
        )}
      </Box>

      {/* Expand button when sidebar is closed */}
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

      {/* Right Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
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
