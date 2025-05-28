// src/theme/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5', // Rich blue for buttons, headings, and key actions
    },
    secondary: {
      main: '#ab47bc', // Soft purple for accents or secondary actions
    },
    background: {
      default: '#f7f9fb', // Light gray background
      paper: '#ffffff', // White cards
    },
    text: {
      primary: '#212121',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      textAlign: 'center',
      marginBottom: '1.5rem',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: '1.5rem',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#212121',
    },
    body2: {
      fontSize: '0.95rem',
      color: '#555',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: '#f7f9fb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: '"Inter", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        '#root': {
          width: '100%',
          maxWidth: '700px',
          padding: '2rem',
          boxSizing: 'border-box',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});

export default theme;
