import { grey } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',

  background: {
    default: darkMode ? '#0B1724' : '#F5F7FA',
    paper: darkMode ? '#132536' : '#FFFFFF',
  },

  primary: {
    main: validatedColor(server?.attributes?.colorPrimary)
      || (darkMode ? '#6F9CC4' : '#0F2742'),
    dark: darkMode ? '#527EA5' : '#163A5F',
    contrastText: '#FFFFFF',
  },

  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary)
      || (darkMode ? '#5CCBC5' : '#18A7A0'),
    dark: darkMode ? '#3AA9A3' : '#12837E',
    contrastText: '#FFFFFF',
  },

  text: {
    primary: darkMode ? '#F3F6F8' : '#172230',
    secondary: darkMode ? '#AAB7C4' : '#667085',
  },

  divider: darkMode ? '#2B4052' : '#D9E0E7',

  neutral: {
    main: grey[500],
  },

  geometry: {
    main: '#18A7A0',
  },

  alwaysDark: {
    main: '#0F2742',
  },

  success: {
    main: '#2E8B57',
  },

  warning: {
    main: '#D99019',
  },

  error: {
    main: '#C43D4B',
  },

  info: {
    main: '#3478C0',
  },
});