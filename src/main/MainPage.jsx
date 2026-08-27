import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import DeviceList from './DeviceList';
import BottomMenu from '../common/components/BottomMenu';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store';
import usePersistedState from '../common/util/usePersistedState';
import EventsDrawer from './EventsDrawer';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';
import { useAttributePreference } from '../common/util/preferences';

const MainMap = lazy(() => import('./MainMap'));

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
  },

  sidebar: {
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: `calc(100% - ${theme.spacing(3)})`,
      width: theme.dimensions.drawerWidthDesktop,
      margin: theme.spacing(1.5),
      zIndex: 3,

      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 28px rgba(15, 39, 66, 0.16)',
    },

    [theme.breakpoints.down('md')]: {
      height: '100%',
      width: '100%',
    },
  },

  header: {
    pointerEvents: 'auto',
    zIndex: 6,

    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },

  footer: {
    pointerEvents: 'auto',
    zIndex: 5,

    [theme.breakpoints.up('md')]: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },

  middle: {
    flex: 1,
    display: 'grid',
    minHeight: 0,
  },

  contentMap: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
  },

  contentList: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
    zIndex: 4,
    display: 'flex',
    minHeight: 0,
  },
}));

const MainPage = () => {
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const mapOnSelect = useAttributePreference('mapOnSelect', true);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const positions = useSelector((state) => state.session.positions);

  const userId = useSelector((state) => state.session.user?.id);

  const [filteredPositions, setFilteredPositions] = useState([]);

  const [hiddenDeviceIds, setHiddenDeviceIds] = usePersistedState(
    `neocoreHiddenDevices:${userId || 'guest'}`,
    [],
  );

  const visiblePositions = filteredPositions.filter(
    (position) => !hiddenDeviceIds.includes(position.deviceId),
  );

  const selectedPosition = visiblePositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId,
  );

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState('');

  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(keyword, positions, setFilteredDevices, setFilteredPositions);

  return (
    <div className={classes.root}>
      {desktop && (
        <Suspense fallback={null}>
          <MainMap
            filteredPositions={visiblePositions}
            selectedPosition={selectedPosition}
            onEventsClick={onEventsClick}
          />
        </Suspense>
      )}

      <div className={classes.sidebar}>
        <Paper square elevation={3} className={classes.header}>
          <MainToolbar
            filteredDevices={filteredDevices}
            devicesOpen={devicesOpen}
            setDevicesOpen={setDevicesOpen}
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </Paper>

        <div className={classes.middle}>
          {!desktop && (
            <div className={classes.contentMap}>
              <Suspense fallback={null}>
                <MainMap
                  filteredPositions={visiblePositions}
                  selectedPosition={selectedPosition}
                  onEventsClick={onEventsClick}
                />
              </Suspense>
            </div>
          )}

          <Paper
            square
            className={classes.contentList}
            style={devicesOpen ? {} : { visibility: 'hidden' }}
          >
            <DeviceList
              devices={filteredDevices}
              hiddenDeviceIds={hiddenDeviceIds}
              setHiddenDeviceIds={setHiddenDeviceIds}
            />
          </Paper>
        </div>

        {desktop && (
          <div className={classes.footer}>
            <BottomMenu />
          </div>
        )}
      </div>

      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />

      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default MainPage;
