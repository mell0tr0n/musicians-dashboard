import React, { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { Project } from './models/Project';
import sampleProjects from './mock/sampleProjects';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';

const App = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProject = (data) => {
    const newProject = new Project(
      data.title,
      data.chordsUrl,
      data.tags,
      data.notes
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
      {/* Left Panel */}
      <Box
        sx={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}
      >
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

        <Box sx={{ p: 2 }}>
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
        </Box>
      </Box>

      {/* Right Panel */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
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
