import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import NeoCoreLogo from './NeoCoreLogo';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    minHeight: '100dvh',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,

    [theme.breakpoints.down('lg')]: {
      justifyContent: 'flex start',
      alignItems: 'center',
      padding: theme.spacing(10, 2, 3),
      backgroundColor: theme.palette.primary.main,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  },

  sidebar: {
    position: 'relative',
    width: theme.dimensions.sidebarWidth,
    minWidth: theme.dimensions.sidebarWidth,
    height: '100%',
    overflow: 'hidden',
    padding: theme.spacing(7, 5, 5),
    background: `
      linear-gradient(
        180deg,
        #0F2742 0%,
        #0C223B 55%,
        #081C32 100%
      )
    `,

    [theme.breakpoints.down('lg')]: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      minWidth: 0,
      height: '100%',
      padding: 0,
      pointerEvents: 'none',
    },
  },

  desktopContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },

  logoWrapper: {
    marginBottom: theme.spacing(2),
  },

  tagline: {
    margin: 0,
    color: theme.palette.secondary.main,
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: 1.4,
  },

  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3.2),
    marginTop: theme.spacing(6),
  },

  benefit: {
    display: 'grid',
    gridTemplateColumns: '42px 1fr',
    gap: theme.spacing(1.7),
    alignItems: 'start',
  },

  benefitIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    border: `1.5px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
    color: theme.palette.secondary.main,
  },

  benefitText: {
    minWidth: 0,
  },

  benefitTitle: {
    margin: 0,
    color: '#FFFFFF',
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: 1.3,
  },

  benefitDescription: {
    margin: theme.spacing(0.5, 0, 0),
    color: 'rgba(255, 255, 255, 0.72)',
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.45,
  },

  decorativeGlow: {
    position: 'absolute',
    zIndex: 0,
    left: '-25%',
    bottom: '-18%',
    width: '150%',
    height: '48%',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(24, 167, 160, 0.18) 0%, rgba(24, 167, 160, 0.04) 42%, transparent 70%)',
    pointerEvents: 'none',
  },

  decorativeGrid: {
    position: 'absolute',
    zIndex: 1,
    left: '-10%',
    right: '-10%',
    bottom: '-30px',
    height: '250px',
    opacity: 0.38,
    transform: 'perspective(420px) rotateX(62deg)',
    transformOrigin: 'bottom center',
    backgroundImage: `
      linear-gradient(
        rgba(24, 167, 160, 0.28) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(24, 167, 160, 0.28) 1px,
        transparent 1px
      )
    `,
    backgroundSize: '22px 22px',
    maskImage:
      'linear-gradient(to top, rgba(0, 0, 0, 1), transparent)',
    pointerEvents: 'none',

    [theme.breakpoints.down('lg')]: {
      left: '-20%',
      right: '-20%',
      bottom: '-50px',
      height: '280px',
      opacity: 0.25,
    },
  },

  paperWrapper: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,

    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(18),
    },

    [theme.breakpoints.down('lg')]: {
      width: '100%',
      flex: 'initial',
    },
  },

  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '540px',
    minHeight: '480px',
    padding: theme.spacing(6),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '20px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 18px 50px rgba(15, 39, 66, 0.10)',

    [theme.breakpoints.up('lg')]: {
      border: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },

    [theme.breakpoints.down('sm')]: {
      maxWidth: '430px',
      minHeight: 'auto',
      padding: theme.spacing(4, 3),
      borderRadius: '18px',
      boxShadow: '0 20px 55px rgba(0, 0, 0, 0.22)',
    },
  },

  form: {
    width: '100%',
    maxWidth: '448px',
    margin: '0 auto',
  },
}));

const MonitorIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M7 11H9.3L10.7 8L13 14L14.6 11H17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21H15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 17V21"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18 8A6 6 0 0 0 6 8C6 15 3.5 16 3.5 16H20.5C20.5 16 18 15 18 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 20H14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SecurityIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3L19 6V11C19 15.6 16.1 19.2 12 21C7.9 19.2 5 15.6 5 11V6L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <rect
      x="9"
      y="10"
      width="6"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M10.5 10V8.8C10.5 7.8 11.2 7 12 7C12.8 7 13.5 7.8 13.5 8.8V10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();

  return (
    <main className={classes.root}>
      <aside className={classes.sidebar}>
        <div className={classes.desktopContent}>
          <div className={classes.logoWrapper}>
            <NeoCoreLogo
              variant="light"
              width={300}
            />
          </div>

          <p className={classes.tagline}>
            Control y seguimiento en tiempo real
          </p>

          <div className={classes.benefits}>
            <div className={classes.benefit}>
              <div className={classes.benefitIcon}>
                <MonitorIcon />
              </div>

              <div className={classes.benefitText}>
                <p className={classes.benefitTitle}>
                  Monitoreo en vivo
                </p>

                <p className={classes.benefitDescription}>
                  Visualiza el estado y ubicación de tus activos
                  en tiempo real.
                </p>
              </div>
            </div>

            <div className={classes.benefit}>
              <div className={classes.benefitIcon}>
                <AlertIcon />
              </div>

              <div className={classes.benefitText}>
                <p className={classes.benefitTitle}>
                  Alertas inteligentes
                </p>

                <p className={classes.benefitDescription}>
                  Recibe notificaciones y alertas para actuar
                  a tiempo.
                </p>
              </div>
            </div>

            <div className={classes.benefit}>
              <div className={classes.benefitIcon}>
                <SecurityIcon />
              </div>

              <div className={classes.benefitText}>
                <p className={classes.benefitTitle}>
                  Acceso seguro
                </p>

                <p className={classes.benefitDescription}>
                  Protegemos tu información con una interfaz
                  de acceso clara y segura.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.decorativeGlow} />
        <div className={classes.decorativeGrid} />
      </aside>

      <div className={classes.paperWrapper}>
        <Paper
          className={classes.paper}
          elevation={0}
        >
          <form className={classes.form}>
            {children}
          </form>
        </Paper>
      </div>
    </main>
  );
};

export default LoginLayout;