import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  TextField,
} from '@mui/material';

const ProjectList = ({
  projects,
  onSelect,
  selectedIndex,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
        Your Projects
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      />

      <List>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => onSelect(project, index)}
              >
                <ListItemText
                  primary={
                    <Box component="span">
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#4B1248',
                        }}
                      >
                        {project.title}
                      </Typography>
                      {project.artist && (
                        <>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              fontSize: '1rem',
                              color: 'text.primary',
                              ml: 0.5,
                            }}
                          >
                            {' by '}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,
                              fontSize: '1rem',
                              color: 'text.primary',
                            }}
                          >
                            {project.artist}
                          </Typography>
                        </>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ProjectList;
