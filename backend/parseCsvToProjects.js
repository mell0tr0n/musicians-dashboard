// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects from backend
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel: Project List */}
      <Box width="30%" p={2} borderRight="1px solid #ccc" overflow="auto">
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>
        <Divider />
        <ProjectList
          projects={projects}
          onSelect={(project) => setSelectedProject(project)}
        />
      </Box>

      {/* Right Panel: Project Detail */}
      <Box flexGrow={1} p={2} overflow="auto">
        {selectedProject ? (
          <ProjectDetail project={selectedProject} />
        ) : (
          <Typography variant="body1">
            Select a project to view details
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default App;
