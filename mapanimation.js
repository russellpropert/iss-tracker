import * as mapboxgl from 'mapbox-gl/esm';
import 'mapbox-gl/dist/mapbox-gl.css';

const intervalTime = 3000;

let map;
let issMarker;
let geojson = {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'MultiLineString',
      coordinates: [[]]
    }
  }
};
let numberOfCoordinates = 0;

const geoJsonCoordinatesLastLineIndex = () => geojson.data.geometry.coordinates.length - 1;

const getIssLocation = async () => {
  try {
    const url = 'https://api.wheretheiss.at/v1/satellites/25544';
    const response = await fetch(url);
    const data = await response.json();

    const longitude = Number(data.longitude);
    const latitude = Number(data.latitude);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      throw new Error('The API did not return valid numeric values for coordinates.');
    }

    const lastLongitude = geojson.data.geometry.coordinates[geoJsonCoordinatesLastLineIndex()]?.at(-1)?.[0];

    if (longitude - lastLongitude < -180) {
      geojson.data.geometry.coordinates[geoJsonCoordinatesLastLineIndex()].push([longitude + 360, latitude]);
      geojson.data.geometry.coordinates.push([]);
    }

    if (longitude - lastLongitude > 180) {
      geojson.data.geometry.coordinates[geoJsonCoordinatesLastLineIndex()].push([longitude - 360, latitude]);
      geojson.data.geometry.coordinates.push([]);
    }

    geojson.data.geometry.coordinates[geoJsonCoordinatesLastLineIndex()].push([longitude, latitude]);
    numberOfCoordinates++;

    if (numberOfCoordinates > 2860) {
      geojson.data.geometry.coordinates[0].shift();
      if (geojson.data.geometry.coordinates[0].length === 0) {
        geojson.data.geometry.coordinates.shift();
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};

const markerPosition = () => geojson.data.geometry.coordinates[geoJsonCoordinatesLastLineIndex()].at(-1);

const updateIssLocation = async () => {
  const isSuccess = await getIssLocation();
  if (isSuccess) {
    issMarker.setLngLat(markerPosition());
    map.getSource('lineCoordinates').setData(geojson.data);
  }
};

const loop = async () => {
  try {
    await updateIssLocation();
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(loop, intervalTime);
  }
};

const retryTimeout = () => {
  return new Promise((res) => {
    setTimeout(res, intervalTime);
  });
};

const initMap = async () => {
  let isSuccess = await getIssLocation();

  while (!isSuccess) {
    await retryTimeout();
    isSuccess = await getIssLocation();
  }

  map = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOXGL_ACCESSTOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [0, 0],
    zoom: 2
  });

  map.on('load', () => {
    map.addSource('lineCoordinates', geojson);

    map.addLayer({
      'id': 'ISS',
      'type': 'line',
      'source': 'lineCoordinates',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': 'blue',
        'line-opacity': 1,
        'line-width': 4
      }
    });

    const coordinates = markerPosition();

    map.flyTo({
      center: coordinates,
      zoom: 3,
      speed: 0.2
    });

    issMarker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map);

    loop();
  });
};

initMap();
