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
  onSaveToProject,
}) => {
  const isSaveMode = !!onSaveToProject;

  return (
    <Box>
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
              selected={!isSaveMode && index === selectedIndex}
              onClick={() =>
                isSaveMode ? onSaveToProject(project) : onSelect(project, index)
              }
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: isSaveMode ? '#dceefc' : undefined,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {project.title}
                  </Typography>
                }
                secondary={
                  project.artist && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      by {project.artist}
                    </Typography>
                  )
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
