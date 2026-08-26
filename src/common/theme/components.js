export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: '48px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },

        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.main,
          borderWidth: '1.5px',
        },

        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${
            theme.palette.mode === 'dark'
              ? 'rgba(92, 203, 197, 0.14)'
              : 'rgba(24, 167, 160, 0.12)'
          }`,
        },
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
      },

      sizeMedium: {
        minHeight: '44px',
      },

      contained: {
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: '12px',
      },
    },
  },

  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },

  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },

  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
    },
  },
};