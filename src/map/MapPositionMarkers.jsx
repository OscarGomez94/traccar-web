import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import MapMarkers from './MapMarkers';
import { formatTime } from '../common/util/formatter';
import { mapIconKey } from './core/preloadImages';
import { useAttributePreference } from '../common/util/preferences';
import { fromMapCoordinates } from './core/mapUtil';

const STALE_LOCATION_TIME = 24 * 60 * 60 * 1000;

// NeoCore M02 animation settings.
// Visual only: stored GPS positions are never modified.
const ANIMATION_DURATION = 2000;
const LIVE_POSITION_THRESHOLD = 90 * 1000;
const NORMAL_REPORT_GAP_THRESHOLD = 90 * 1000;

const MapPositionMarkers = ({
  positions,
  onMapClick,
  onMarkerClick,
  showStatus,
  selectedPosition,
  titleField,
  disabled,
}) => {
  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const mapCluster = useAttributePreference('mapCluster', true);
  const directionType = useAttributePreference('mapDirection', 'selected');

  const animationFrameRef = useRef();
  const renderedCoordinatesRef = useRef(new Map());
  const renderedPositionMetaRef = useRef(new Map());

  const [renderedMarkers, setRenderedMarkers] = useState([]);

  const onMapClickCallback = useCallback(
    (event) => {
      if (!event.defaultPrevented && onMapClick) {
        const [longitude, latitude] = fromMapCoordinates(
          event.lngLat.lng,
          event.lngLat.lat,
        );

        onMapClick(latitude, longitude);
      }
    },
    [onMapClick],
  );

  useEffect(() => {
    map.on('click', onMapClickCallback);

    return () => {
      map.off('click', onMapClickCallback);
    };
  }, [onMapClickCallback]);

  const buildMarker = useCallback(
    (position, latitude = position.latitude, longitude = position.longitude) => {
      const device = devices[position.deviceId];

      let showDirection;

      switch (directionType) {
        case 'none':
          showDirection = false;
          break;

        case 'all':
          showDirection = position.course > 0;
          break;

        default:
          showDirection =
            selectedPosition?.id === position.id && position.course > 0;
          break;
      }

      const fixTime = position.fixTime
        ? new Date(position.fixTime).getTime()
        : 0;

      const locationAge = fixTime
        ? Date.now() - fixTime
        : STALE_LOCATION_TIME;

      const staleLocation = locationAge >= STALE_LOCATION_TIME;

      let color = 'neutral';

      if (showStatus && !staleLocation) {
        color = position.speed > 0 ? 'success' : 'warning';
      }

      const speed = Math.round((position.speed || 0) * 1.852);

      const titles = {
        name: `${device.name} · ${speed} km/h`,
        fixTime: formatTime(position.fixTime, 'seconds'),
      };

      return {
        id: position.id,
        deviceId: position.deviceId,
        latitude,
        longitude,
        image: `${mapIconKey(device.category)}-${color}`,
        title: titles[titleField || 'name'],
        rotation: position.course,
        direction: showDirection,
      };
    },
    [
      devices,
      directionType,
      selectedPosition,
      showStatus,
      titleField,
    ],
  );

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    const validPositions = positions.filter((position) =>
      devices.hasOwnProperty(position.deviceId),
    );

    const now = Date.now();
    const animations = new Map();

    validPositions.forEach((position) => {
      const deviceId = position.deviceId;

      const target = {
        latitude: position.latitude,
        longitude: position.longitude,
      };

      const previousCoordinates =
        renderedCoordinatesRef.current.get(deviceId);

      const previousMeta =
        renderedPositionMetaRef.current.get(deviceId);

      const currentFixTime = new Date(position.fixTime).getTime();

      const previousFixTime = previousMeta?.fixTime
        ? new Date(previousMeta.fixTime).getTime()
        : null;

      const positionChanged =
        previousMeta?.positionId !== position.id;

      const fixTimeGap =
        previousFixTime != null && Number.isFinite(currentFixTime)
          ? currentFixTime - previousFixTime
          : null;

      const positionAge = Number.isFinite(currentFixTime)
        ? now - currentFixTime
        : Infinity;

      /*
       * Animate only normal live updates.
       *
       * We intentionally do NOT animate:
       * - first position received;
       * - old/historical positions;
       * - reconnect batches;
       * - long gaps between GPS reports.
       *
       * In those cases the marker jumps directly to the real position
       * instead of visually lagging behind the vehicle.
       */
      const shouldAnimate =
        positionChanged &&
        previousCoordinates &&
        positionAge >= 0 &&
        positionAge <= LIVE_POSITION_THRESHOLD &&
        fixTimeGap != null &&
        fixTimeGap > 0 &&
        fixTimeGap <= NORMAL_REPORT_GAP_THRESHOLD;

      animations.set(deviceId, {
        start: shouldAnimate ? previousCoordinates : target,
        target,
        animate: shouldAnimate,
      });

      if (!shouldAnimate) {
        renderedCoordinatesRef.current.set(deviceId, target);
      }

      renderedPositionMetaRef.current.set(deviceId, {
        positionId: position.id,
        fixTime: position.fixTime,
      });
    });

    const visibleDeviceIds = new Set(
      validPositions.map((position) => position.deviceId),
    );

    renderedCoordinatesRef.current.forEach((_, deviceId) => {
      if (!visibleDeviceIds.has(deviceId)) {
        renderedCoordinatesRef.current.delete(deviceId);
        renderedPositionMetaRef.current.delete(deviceId);
      }
    });

    const render = (progress) => {
      const markers = validPositions.map((position) => {
        const animation = animations.get(position.deviceId);

        let latitude =
          animation?.target.latitude ?? position.latitude;

        let longitude =
          animation?.target.longitude ?? position.longitude;

        if (animation?.animate) {
          latitude =
            animation.start.latitude +
            (animation.target.latitude - animation.start.latitude) *
              progress;

          longitude =
            animation.start.longitude +
            (animation.target.longitude - animation.start.longitude) *
              progress;

          renderedCoordinatesRef.current.set(position.deviceId, {
            latitude,
            longitude,
          });
        }

        return buildMarker(position, latitude, longitude);
      });

      setRenderedMarkers(markers);
    };

    const hasAnimations = Array.from(animations.values()).some(
      (animation) => animation.animate,
    );

    if (!hasAnimations) {
      render(1);
      return undefined;
    }

    const startedAt = performance.now();

    const animateFrame = (timestamp) => {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(
        elapsed / ANIMATION_DURATION,
        1,
      );

      // Smoothstep: soft acceleration and deceleration.
      const easedProgress =
        progress * progress * (3 - 2 * progress);

      render(easedProgress);

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animateFrame);
      } else {
        animations.forEach((animation, deviceId) => {
          renderedCoordinatesRef.current.set(
            deviceId,
            animation.target,
          );
        });

        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animateFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [positions, devices, buildMarker]);

  const onClick = useCallback(
    (properties) => {
      onMarkerClick?.(
        properties.id,
        properties.deviceId,
      );
    },
    [onMarkerClick],
  );

  return (
    <>
      <MapMarkers
        markers={renderedMarkers.filter(
          (marker) =>
            marker.deviceId !== selectedDeviceId,
        )}
        showTitles
        direction
        cluster={mapCluster}
        onClick={onClick}
        disabled={disabled}
      />

      <MapMarkers
        markers={renderedMarkers.filter(
          (marker) =>
            marker.deviceId === selectedDeviceId,
        )}
        showTitles
        direction
        priority
        onClick={onClick}
        disabled={disabled}
      />
    </>
  );
};

export default MapPositionMarkers;