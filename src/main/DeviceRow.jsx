import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { IconButton, ListItemButton, Tooltip, Typography } from '@mui/material';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';

import dayjs from 'dayjs';

import { devicesActions } from '../store';
import { formatAlarm, formatBoolean, formatPercentage } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';

const useStyles = makeStyles()((theme) => ({
  rowContainer: {
    padding: theme.spacing(0.3, 0.7),
  },

  groupRow: {
    minHeight: '52px',
    padding: theme.spacing(0.45, 0.9),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F3F6F9',
    transition: 'background-color 140ms ease, border-color 140ms ease',

    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.action.hover : '#EDF2F6',
      borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#CBD5E1',
    },
  },

  deviceRow: {
    minHeight: '52px',
    padding: theme.spacing(0.4, 0.9),
    borderRadius: '9px',
    transition: 'background-color 140ms ease',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },

  selected: {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(92, 203, 197, 0.12)' : '#EAF7F5',

    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(92, 203, 197, 0.16)' : '#E1F3F0',
    },
  },

  visibilityButton: {
    marginRight: theme.spacing(0.45),
    padding: '4px',
    color: theme.palette.secondary.main,
    flexShrink: 0,
  },

  visibilityOff: {
    marginRight: theme.spacing(0.45),
    padding: '4px',
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },

  groupContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  groupText: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  groupName: {
    overflow: 'hidden',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  groupCount: {
    marginLeft: theme.spacing(0.55),
    color: theme.palette.text.secondary,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.2,
    flexShrink: 0,
  },

  collapseButton: {
    marginLeft: theme.spacing(0.4),
    padding: '4px',
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },

  deviceContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },

  deviceName: {
    overflow: 'hidden',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  deviceUpdate: {
    marginTop: '2px',
    overflow: 'hidden',
    color: theme.palette.text.secondary,
    fontSize: '11.5px',
    fontWeight: 400,
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  indicators: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px',
    marginLeft: theme.spacing(0.45),
    marginRight: theme.spacing(0.45),
    flexShrink: 0,
  },

  indicatorButton: {
    padding: '2px',
  },

  success: {
    color: theme.palette.success.main,
  },

  warning: {
    color: theme.palette.warning.main,
  },

  error: {
    color: theme.palette.error.main,
  },

  neutral: {
    color: theme.palette.neutral.main,
  },

  speed: {
    minWidth: '58px',
    marginLeft: theme.spacing(0.35),
    color: theme.palette.secondary.main,
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: 'right',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
}));

const DeviceRow = ({
  rows,
  index,
  style,
  hiddenDeviceIds,
  toggleDeviceVisibility,
  toggleGroupVisibility,
  toggleGroupCollapsed,
}) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const positions = useSelector((state) => state.session.positions);

  const row = rows[index];

  if (!row) {
    return null;
  }

  if (row.type === 'group') {
    const allVisible = row.devices.every((device) => !hiddenDeviceIds.includes(device.id));

    return (
      <div style={style} className={classes.rowContainer}>
        <ListItemButton
          className={classes.groupRow}
          onClick={() => toggleGroupCollapsed(row.groupId)}
        >
          <IconButton
            size="small"
            className={allVisible ? classes.visibilityButton : classes.visibilityOff}
            onClick={(event) => {
              event.stopPropagation();
              toggleGroupVisibility(row.devices);
            }}
          >
            {allVisible ? (
              <RadioButtonCheckedIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
          </IconButton>

          <div className={classes.groupContent}>
            <div className={classes.groupText}>
              <Typography component="span" className={classes.groupName}>
                {row.groupName}
              </Typography>

              <Typography component="span" className={classes.groupCount}>
                ({row.devices.length})
              </Typography>
            </div>

            <IconButton
              size="small"
              className={classes.collapseButton}
              onClick={(event) => {
                event.stopPropagation();
                toggleGroupCollapsed(row.groupId);
              }}
            >
              {row.collapsed ? <AddIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
            </IconButton>
          </div>
        </ListItemButton>
      </div>
    );
  }

  const item = row.device;

  const position = positions[item.id];

  const hidden = hiddenDeviceIds.includes(item.id);

  const lastReport = item.lastUpdate
    ? dayjs(item.lastUpdate).format('DD/MM/YYYY HH:mm:ss')
    : 'Sin reporte';

  const speed = position?.speed ? `${Math.round(position.speed * 1.852)} km/h` : '0 km/h';

  return (
    <div style={style} className={classes.rowContainer}>
      <ListItemButton
        key={item.id}
        className={`${classes.deviceRow} ${selectedDeviceId === item.id ? classes.selected : ''}`}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
      >
        <IconButton
          size="small"
          className={hidden ? classes.visibilityOff : classes.visibilityButton}
          onClick={(event) => {
            event.stopPropagation();
            toggleDeviceVisibility(item.id);
          }}
        >
          {hidden ? (
            <RadioButtonUncheckedIcon fontSize="small" />
          ) : (
            <RadioButtonCheckedIcon fontSize="small" />
          )}
        </IconButton>

        <div className={classes.deviceContent}>
          <Typography component="div" className={classes.deviceName}>
            {item.name}
          </Typography>

          <Typography component="div" className={classes.deviceUpdate}>
            {lastReport}
          </Typography>
        </div>

        {position && (
          <div className={classes.indicators}>
            {position.attributes.hasOwnProperty('alarm') && (
              <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                <IconButton size="small" className={classes.indicatorButton}>
                  <ErrorIcon sx={{ fontSize: 17 }} className={classes.error} />
                </IconButton>
              </Tooltip>
            )}

            {position.attributes.hasOwnProperty('ignition') && (
              <Tooltip
                title={`${t('positionIgnition')}: ${formatBoolean(
                  position.attributes.ignition,
                  t,
                )}`}
              >
                <IconButton size="small" className={classes.indicatorButton}>
                  {position.attributes.ignition ? (
                    <EngineIcon width={17} height={17} className={classes.success} />
                  ) : (
                    <EngineIcon width={17} height={17} className={classes.neutral} />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {position.attributes.hasOwnProperty('batteryLevel') && (
              <Tooltip
                title={`${t('positionBatteryLevel')}: ${formatPercentage(
                  position.attributes.batteryLevel,
                )}`}
              >
                <IconButton size="small" className={classes.indicatorButton}>
                  {position.attributes.batteryLevel > 70 ? (
                    position.attributes.charge ? (
                      <BatteryChargingFullIcon sx={{ fontSize: 17 }} className={classes.success} />
                    ) : (
                      <BatteryFullIcon sx={{ fontSize: 17 }} className={classes.success} />
                    )
                  ) : position.attributes.batteryLevel > 30 ? (
                    position.attributes.charge ? (
                      <BatteryCharging60Icon sx={{ fontSize: 17 }} className={classes.warning} />
                    ) : (
                      <Battery60Icon sx={{ fontSize: 17 }} className={classes.warning} />
                    )
                  ) : position.attributes.charge ? (
                    <BatteryCharging20Icon sx={{ fontSize: 17 }} className={classes.error} />
                  ) : (
                    <Battery20Icon sx={{ fontSize: 17 }} className={classes.error} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}

        <Typography component="div" className={classes.speed}>
          {speed}
        </Typography>
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
