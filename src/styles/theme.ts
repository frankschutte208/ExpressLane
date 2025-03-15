import { createTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        root?: {
          [key: string]: any;
        };
      };
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#003087', // Liberty's dark blue
      light: '#00A9E0', // Liberty's light blue
    },
    background: {
      default: '#F5F6F5',
    },
    text: {
      primary: '#333333', // Dark Grey
    },
  },
  typography: {
    fontFamily: '"DIN Next Pro Regular", Arial, Helvetica, sans-serif',
    h1: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
    h2: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
    h3: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
    h4: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
    h5: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
    h6: {
      fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            fontSize: '14px',
            fontFamily: '"DIN Next Pro Regular", Arial, sans-serif',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: '14px',
            fontFamily: '"DIN Next Pro Bold", Arial, sans-serif',
          },
        },
      },
    },
  },
});

export default theme; 