// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3C3253', // English Violet
    },
    secondary: {
      main: '#61568F', // Ultra Violet
    },
    background: {
      default: '#A6C9C5', // Light Grayish Green
      paper: '#ffffff',
    },
    text: {
      primary: '#292633', // Raisin Black
      secondary: '#555',
    },
    info: {
      main: '#5B948D', // Dark Cyan
    },
    success: {
      main: '#7AAFB4', // Moonstone
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
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      textAlign: 'center',
      marginBottom: '1rem',
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
        body: {
          backgroundColor: '#f8f9fb',
        },
        '#root': {
          width: '100%',
          maxWidth: '760px',
          margin: '0 auto',
          padding: '2rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.85rem',
          backgroundColor: '#5B948D',
          color: '#fff',
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
