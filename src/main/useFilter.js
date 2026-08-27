import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default (keyword, positions, setFilteredDevices, setFilteredPositions) => {
  const devices = useSelector((state) => state.devices.items);

  useEffect(() => {
    const lowerCaseKeyword = keyword.trim().toLowerCase();

    const filtered = Object.values(devices).filter(
      (device) =>
        !lowerCaseKeyword ||
        [device.name, device.uniqueId, device.phone, device.model, device.contact].some(
          (value) => value && value.toLowerCase().includes(lowerCaseKeyword),
        ),
    );

    setFilteredDevices(filtered);

    setFilteredPositions(Object.values(positions));
  }, [keyword, devices, positions, setFilteredDevices, setFilteredPositions]);
};
