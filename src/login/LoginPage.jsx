import { useEffect, useRef, useState } from 'react';
import {
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import CountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sessionActions } from '../store';
import {
  useLocalization,
  useTranslation,
} from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from '../common/components/NativeInterface';
import NeoCoreLogo from './NeoCoreLogo';
import { useCatch } from '../reactHelper';
import QrCodeDialog from '../common/components/QrCodeDialog';
import PasswordField from '../common/components/PasswordField';

const useStyles = makeStyles()((theme) => ({
  desktopOptions: {
    position: 'fixed',
    zIndex: 10,
    top: theme.spacing(2.5),
    right: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.7),

    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.5),
    },
  },

  mobileLogo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(0.8),

    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.4),
    },
  },

  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),

    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },

  title: {
    color: theme.palette.text.primary,
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    fontSize: '32px',
    letterSpacing: '-0.7px',
    lineHeight: 1.15,

    [theme.breakpoints.down('sm')]: {
      fontSize: '27px',
    },
  },

  subtitle: {
    marginTop: theme.spacing(0.6),
    color:
      theme.palette.mode === 'dark'
        ? 'rgba(243, 246, 248, 0.72)'
        : theme.palette.text.secondary,
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: 1.4,

    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
      marginTop: theme.spacing(0.4),
    },
  },

  loginButton: {
    marginTop: theme.spacing(0.3),
    minHeight: '50px',
    fontSize: '16px',

    '&.Mui-disabled': {
      color:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.42)'
          : 'rgba(23, 34, 48, 0.38)',
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(15, 39, 66, 0.12)',
    },
  },

  passwordReset: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(0.2),
  },

  extraContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(0.2),
  },

  link: {
    cursor: 'pointer',
    fontSize: '14px',
  },

  mobileOptions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.2),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1.7),
    borderTop: `1px solid ${
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : theme.palette.divider
    }`,

    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
    },
  },

  mobileOptionButton: {
    minHeight: '44px',
    fontSize: '14px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },

  languageControl: {
    width: '100%',

    '& .MuiOutlinedInput-root': {
      minHeight: '44px',
    },
  },

  flag: {
    marginRight: theme.spacing(1),
  },

  footer: {
    marginTop: theme.spacing(2.4),
    textAlign: 'center',
    color:
      theme.palette.mode === 'dark'
        ? 'rgba(243, 246, 248, 0.68)'
        : theme.palette.text.secondary,
    fontFamily:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '12px',

    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1.8),
    },
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const compactLayout = useMediaQuery(
    theme.breakpoints.down('lg'),
  );

  const { languages, language, setLocalLanguage } =
    useLocalization();

  const languageList = Object.entries(languages).map(
    (values) => ({
      code: values[0],
      country: values[1].country,
      name: values[1].name,
    }),
  );

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState(
    'loginEmail',
    '',
  );

  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const [showServerTooltip, setShowServerTooltip] =
    useState(false);

  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector(
    (state) => state.session.server.registration,
  );

  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;

    return (
      !attributes.language
      && !attributes['ui.disableLoginLanguage']
    );
  });

  const changeEnabled = useSelector(
    (state) =>
      !state.session.server.attributes.disableChange,
  );

  const emailEnabled = useSelector(
    (state) => state.session.server.emailEnabled,
  );

  const openIdEnabled = useSelector(
    (state) => state.session.server.openIdEnabled,
  );

  const openIdForced = useSelector(
    (state) =>
      state.session.server.openIdEnabled
      && state.session.server.openIdForce,
  );

  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] =
    useState(false);

  const announcement = useSelector(
    (state) => state.session.server.announcement,
  );

  const handlePasswordLogin = async (event) => {
    event.preventDefault();

    setFailed(false);

    try {
      const query =
        `email=${encodeURIComponent(email)}`
        + `&password=${encodeURIComponent(password)}`;

      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(
          code.length
            ? `${query}&code=${code}`
            : query,
        ),
      });

      if (response.ok) {
        const user = await response.json();

        generateLoginToken();

        dispatch(
          sessionActions.updateUser(user),
        );

        const target =
          window.sessionStorage.getItem('postLogin')
          || '/';

        window.sessionStorage.removeItem('postLogin');

        navigate(target, {
          replace: true,
        });
      } else if (
        response.status === 401
        && response.headers.get(
          'WWW-Authenticate',
        ) === 'TOTP'
      ) {
        setCodeEnabled(true);
      } else {
        throw Error(
          await response.text(),
        );
      }
    } catch {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(
    async (token) => {
      const response = await fetch(
        `/api/session?token=${encodeURIComponent(token)}`,
      );

      if (response.ok) {
        const user = await response.json();

        dispatch(
          sessionActions.updateUser(user),
        );

        navigate('/');
      } else if (response.status === 401) {
        nativePostMessage('logout');
      }
    },
  );

  const handleTokenLoginRef =
    useRef(handleTokenLogin);

  handleTokenLoginRef.current =
    handleTokenLogin;

  const handleOpenIdLogin = () => {
    document.location =
      '/api/session/openid/auth';
  };

  useEffect(
    () => nativePostMessage('authentication'),
    [],
  );

  useEffect(() => {
    const listener = (token) =>
      handleTokenLoginRef.current(token);

    handleLoginTokenListeners.add(listener);

    return () =>
      handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (
      window.localStorage.getItem('hostname')
      !== window.location.hostname
    ) {
      window.localStorage.setItem(
        'hostname',
        window.location.hostname,
      );

      setShowServerTooltip(true);
    }
  }, []);

  const languageSelector = (
    <FormControl
      className={classes.languageControl}
    >
      <Select
        value={language}
        onChange={(event) =>
          setLocalLanguage(event.target.value)}
      >
        {languageList.map((item) => (
          <MenuItem
            key={item.code}
            value={item.code}
          >
            <span className={classes.flag}>
              <CountryFlag
                countryCode={item.country}
                svg
              />
            </span>

            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <LoginLayout>
      {!compactLayout && (
        <div className={classes.desktopOptions}>
          {nativeEnvironment
            && changeEnabled && (
              <Tooltip
                title={`${t('settingsServer')}: ${window.location.hostname}`}
                open={showServerTooltip}
                arrow
              >
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate('/change-server')}
                >
                  <VpnLockIcon />
                </IconButton>
              </Tooltip>
            )}

          {!nativeEnvironment && (
            <IconButton
              color="primary"
              onClick={() =>
                setShowQr(true)}
            >
              <QrCode2Icon />
            </IconButton>
          )}

          {languageEnabled
            && languageSelector}
        </div>
      )}

      <div className={classes.container}>
        {compactLayout && (
          <div className={classes.mobileLogo}>
            <NeoCoreLogo
              variant={
                theme.palette.mode === 'dark'
                  ? 'light'
                  : 'dark'
              }
              compact
              width={230}
            />
          </div>
        )}

        <div className={classes.heading}>
          <Typography
            component="h1"
            className={classes.title}
          >
            Bienvenido
          </Typography>

          <Typography
            component="p"
            className={classes.subtitle}
          >
            Ingresa a tu cuenta
          </Typography>
        </div>

        {!openIdForced && (
          <>
            <TextField
              required
              error={failed}
              label={t('userEmail')}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(event) =>
                setEmail(event.target.value)}
              helperText={
                failed
                  ? 'Invalid username or password'
                  : undefined
              }
            />

            <PasswordField
              required
              error={failed}
              label={t('userPassword')}
              name="password"
              value={password}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(event) =>
                setPassword(event.target.value)}
            />

            {codeEnabled && (
              <TextField
                required
                error={failed}
                label={t('loginTotpCode')}
                name="code"
                value={code}
                type="number"
                onChange={(event) =>
                  setCode(event.target.value)}
              />
            )}

            <Button
              className={classes.loginButton}
              onClick={handlePasswordLogin}
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !email
                || !password
                || (
                  codeEnabled
                  && !code
                )
              }
            >
              {t('loginLogin')}
            </Button>

            {emailEnabled && (
              <div
                className={
                  classes.passwordReset
                }
              >
                <Link
                  onClick={() =>
                    navigate(
                      '/reset-password',
                    )}
                  className={classes.link}
                  underline="hover"
                >
                  {t('loginReset')}
                </Link>
              </div>
            )}
          </>
        )}

        {openIdEnabled && (
          <Button
            onClick={handleOpenIdLogin}
            variant="outlined"
            color="primary"
          >
            {t('loginOpenId')}
          </Button>
        )}

        {registrationEnabled
          && !openIdForced && (
            <div
              className={
                classes.extraContainer
              }
            >
              <Link
                onClick={() =>
                  navigate('/register')}
                className={classes.link}
                underline="hover"
              >
                {t('loginRegister')}
              </Link>
            </div>
          )}

        {compactLayout && (
          <div
            className={
              classes.mobileOptions
            }
          >
            {!nativeEnvironment ? (
              <Button
                className={
                  classes.mobileOptionButton
                }
                variant="outlined"
                color="primary"
                startIcon={<QrCode2Icon />}
                onClick={() =>
                  setShowQr(true)}
              >
                Acceso QR
              </Button>
            ) : (
              changeEnabled && (
                <Button
                  className={
                    classes.mobileOptionButton
                  }
                  variant="outlined"
                  color="primary"
                  startIcon={<VpnLockIcon />}
                  onClick={() =>
                    navigate(
                      '/change-server',
                    )}
                >
                  Servidor
                </Button>
              )
            )}

            {languageEnabled
              && languageSelector}
          </div>
        )}

        <div className={classes.footer}>
          © 2026 NeoCore Platform
        </div>
      </div>

      <QrCodeDialog
        open={showQr}
        onClose={() =>
          setShowQr(false)}
      />

      <Snackbar
        open={
          !!announcement
          && !announcementShown
        }
        message={announcement}
        action={(
          <IconButton
            size="small"
            color="inherit"
            onClick={() =>
              setAnnouncementShown(true)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </LoginLayout>
  );
};

export default LoginPage;