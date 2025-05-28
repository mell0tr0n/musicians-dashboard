// src/layouts/MainLayout.jsx
import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Container,
  Paper,
} from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="static"
        sx={{
          backgroundColor: 'primary.main',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, letterSpacing: 1 }}
          >
            Musician’s Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Musician’s Dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
