// frontend/src/components/ProjectList.jsx

import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Divider,
} from '@mui/material';

const ProjectList = ({
  projects,
  onSelect,
  selectedIndex,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search Projects"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Divider />

      <List dense>
        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No projects found.
          </Typography>
        ) : (
          projects.map((project, index) => (
            <ListItemButton
              key={project.id || index}
              selected={index === selectedIndex}
              onClick={() => onSelect(project, index)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {project.title || 'Untitled'}
                  </Typography>
                }
                secondary={
                  project.artist ? (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      by {project.artist}
                    </Typography>
                  ) : null
                }
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
};

export default ProjectList;
