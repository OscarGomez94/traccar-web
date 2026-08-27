import { useEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { List } from 'react-window';
import { devicesActions } from '../store';
import { useAsyncTask } from '../reactHelper';
import usePersistedState from '../common/util/usePersistedState';
import DeviceRow from './DeviceRow';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  list: {
    height: '100%',
    direction: theme.direction,
  },
}));

const DeviceList = ({ devices, hiddenDeviceIds, setHiddenDeviceIds }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.items);
  const userId = useSelector((state) => state.session.user?.id);

  const [collapsedGroups, setCollapsedGroups] = usePersistedState(
    `neocoreCollapsedGroups:${userId || 'guest'}`,
    [],
  );

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const interval = setInterval(forceUpdate, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useAsyncTask(
    async ({ signal }) => {
      const response = await fetchOrThrow('/api/devices', { signal });
      dispatch(devicesActions.refresh(await response.json()));
    },
    [dispatch],
  );

  const groupedDevices = useMemo(() => {
    const result = new Map();

    devices.forEach((device) => {
      const groupId = device.groupId || 0;

      if (!result.has(groupId)) {
        result.set(groupId, []);
      }

      result.get(groupId).push(device);
    });

    return result;
  }, [devices]);

  const rows = useMemo(() => {
    const result = [];

    const groupEntries = Array.from(groupedDevices.entries())
      .map(([groupId, groupDevices]) => {
        const group = groups[groupId];

        return {
          groupId,
          groupName: groupId === 0 ? 'Sin grupo' : group?.name || `Grupo ${groupId}`,
          devices: groupDevices,
        };
      })
      .sort((a, b) => {
        if (a.groupId === 0) {
          return 1;
        }

        if (b.groupId === 0) {
          return -1;
        }

        return a.groupName.localeCompare(b.groupName);
      });

    groupEntries.forEach((group) => {
      const collapsed = collapsedGroups.includes(group.groupId);

      result.push({
        type: 'group',
        ...group,
        collapsed,
      });

      if (!collapsed) {
        group.devices.forEach((device) => {
          result.push({
            type: 'device',
            device,
            groupId: group.groupId,
          });
        });
      }
    });

    return result;
  }, [collapsedGroups, groupedDevices, groups]);

  const toggleGroupCollapsed = (groupId) => {
    setCollapsedGroups((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId],
    );
  };

  const toggleDeviceVisibility = (deviceId) => {
    setHiddenDeviceIds((current) =>
      current.includes(deviceId) ? current.filter((id) => id !== deviceId) : [...current, deviceId],
    );
  };

  const toggleGroupVisibility = (groupDevices) => {
    const deviceIds = groupDevices.map((device) => device.id);

    const allVisible = deviceIds.every((deviceId) => !hiddenDeviceIds.includes(deviceId));

    setHiddenDeviceIds((current) => {
      if (allVisible) {
        return Array.from(new Set([...current, ...deviceIds]));
      }

      return current.filter((deviceId) => !deviceIds.includes(deviceId));
    });
  };

  return (
    <List
      className={classes.list}
      rowComponent={DeviceRow}
      rowCount={rows.length}
      rowHeight={64}
      rowProps={{
        rows,
        hiddenDeviceIds,
        toggleDeviceVisibility,
        toggleGroupVisibility,
        toggleGroupCollapsed,
      }}
      overscanCount={5}
    />
  );
};

export default DeviceList;
