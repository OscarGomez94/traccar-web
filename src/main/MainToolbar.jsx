import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  OutlinedInput,
  Popover,
  ListItemButton,
  ListItemText,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';

import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';

import { useTranslation } from '../common/components/LocalizationProvider';
import { useDeviceReadonly } from '../common/util/permissions';
import { devicesActions } from '../store';

const useStyles = makeStyles()((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    minHeight: '72px',
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
  },

  viewButton: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    borderRadius: '10px',
    color: theme.palette.text.secondary,

    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
  },

  search: {
    flex: 1,
    minWidth: 0,

    '& .MuiOutlinedInput-root': {
      minHeight: '46px',
    },
  },

  addButton: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    borderRadius: '10px',
    color: theme.palette.primary.main,

    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.action.hover,
    },
  },

  searchResult: {
    minHeight: '54px',
  },

  searchResultText: {
    '& .MuiListItemText-primary': {
      fontSize: '14px',
      fontWeight: 600,
    },

    '& .MuiListItemText-secondary': {
      fontSize: '12px',
    },
  },

  createMenu: {
    minWidth: '210px',
  },

  createMenuItem: {
    minHeight: '46px',
  },

  createMenuIcon: {
    minWidth: '36px',
    color: theme.palette.text.secondary,
  },
}));

const MainToolbar = ({ filteredDevices, devicesOpen, setDevicesOpen, keyword, setKeyword }) => {
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();

  const devices = useSelector((state) => state.devices.items);
  const devicesLoaded = useSelector((state) => state.devices.loaded);

  const toolbarRef = useRef();

  const [devicesAnchorEl, setDevicesAnchorEl] = useState(null);
  const [createAnchorEl, setCreateAnchorEl] = useState(null);

  const handleDeviceSelect = (deviceId) => {
    dispatch(devicesActions.selectId(deviceId));
    setDevicesAnchorEl(null);
  };

  const handleCreateDevice = () => {
    setCreateAnchorEl(null);
    navigate('/settings/device');
  };

  const handleCreateGroup = () => {
    setCreateAnchorEl(null);
    navigate('/settings/group');
  };

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar} disableGutters>
      <IconButton className={classes.viewButton} onClick={() => setDevicesOpen(!devicesOpen)}>
        {devicesOpen ? <MapIcon /> : <DnsIcon />}
      </IconButton>

      <OutlinedInput
        className={classes.search}
        placeholder={t('sharedSearchDevices')}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onFocus={() => setDevicesAnchorEl(toolbarRef.current)}
        onBlur={() => {
          window.setTimeout(() => {
            setDevicesAnchorEl(null);
          }, 150);
        }}
        size="small"
        fullWidth
      />

      <Popover
        open={!!devicesAnchorEl && !devicesOpen}
        anchorEl={devicesAnchorEl}
        onClose={() => setDevicesAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: Number(theme.spacing(2).slice(0, -2)),
        }}
        marginThreshold={0}
        slotProps={{
          paper: {
            style: {
              width: `calc(${toolbarRef.current?.clientWidth}px - ${theme.spacing(4)})`,
            },
          },
        }}
        elevation={1}
        disableAutoFocus
        disableEnforceFocus
      >
        {filteredDevices.slice(0, 3).map((device) => (
          <ListItemButton
            key={device.id}
            className={classes.searchResult}
            onClick={() => handleDeviceSelect(device.id)}
          >
            <ListItemText
              className={classes.searchResultText}
              primary={device.name}
              secondary={device.uniqueId}
            />
          </ListItemButton>
        ))}

        {filteredDevices.length > 3 && (
          <ListItemButton
            alignItems="center"
            onClick={() => {
              setDevicesOpen(true);
              setDevicesAnchorEl(null);
            }}
          >
            <ListItemText primary={t('notificationAlways')} style={{ textAlign: 'center' }} />
          </ListItemButton>
        )}
      </Popover>

      <IconButton
        className={classes.addButton}
        onClick={(event) => setCreateAnchorEl(event.currentTarget)}
        disabled={deviceReadonly}
      >
        <Tooltip
          open={!deviceReadonly && devicesLoaded && Object.keys(devices).length === 0}
          title={t('deviceRegisterFirst')}
          arrow
        >
          <AddIcon />
        </Tooltip>
      </IconButton>

      <Menu
        anchorEl={createAnchorEl}
        open={Boolean(createAnchorEl)}
        onClose={() => setCreateAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            className: classes.createMenu,
          },
        }}
      >
        <MenuItem className={classes.createMenuItem} onClick={handleCreateDevice}>
          <ListItemIcon className={classes.createMenuIcon}>
            <DnsIcon fontSize="small" />
          </ListItemIcon>
          Nuevo dispositivo
        </MenuItem>

        <MenuItem className={classes.createMenuItem} onClick={handleCreateGroup}>
          <ListItemIcon className={classes.createMenuIcon}>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          Nuevo grupo
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

export default MainToolbar;
