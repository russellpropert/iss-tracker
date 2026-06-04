import MAPBOXGL_ACCESSTOKEN from "./config.js";

//  https://open-notify-api.readthedocs.io/en/latest/iss_location.html
//  https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/


const sim = [[160, -40], [170, -30], [180, -20], [-170, -10], [-160, 0], [160, 10], [170, 20], [180, 30], [-170, 40], [-160, 50], [160, 60], [170, 50], [180, 40], [-170, 30], [-160, 20]];

const coordinates = [];

let map;
let issMarker;
let geojson = {};
let revolutions = 0;

/* global mapboxgl */
mapboxgl.accessToken = MAPBOXGL_ACCESSTOKEN;

const simData = () => {
  const longLat = sim.shift();
  return { iss_position: { longitude: longLat[0], latitude: longLat[1] }};
};

const getIssLocation = async () => {
  // const url = 'http://api.open-notify.org/iss-now.json';
  // const response = await fetch(url);
  // const data = await response.json();

  const data = simData();

  // This adds 360 to the longitude for every time the ISS crosses the antimeridian in order to prevent the mapbox line layer from drawing backwards.
  let longitude = Number(data.iss_position.longitude) + 360 * revolutions;

  const latitude = Number(data.iss_position.latitude);
  if (longitude < coordinates.at(-1)?.[0]) {
    revolutions += 1;
    longitude += 360;
  }
  coordinates.push([longitude, latitude]);
  if (coordinates.length > 6000) coordinates.shift();
  console.log(longitude);
};

const updateIssLocation = async () => {
  await getIssLocation();
  geojson.data.geometry.coordinates = coordinates;
  issMarker.setLngLat(coordinates[coordinates.length - 1]);
  map.getSource('lineCoordinates').setData(geojson.data);
};

const initMap = async () => {
  await getIssLocation();
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: coordinates[0],
    zoom: 3
  });

  map.on('load', () => {
    geojson = {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      }
    };
    
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
  });

  issMarker = new mapboxgl.Marker().setLngLat(coordinates[0]).addTo(map);

  setInterval(updateIssLocation, 3000); 
};

initMap();
