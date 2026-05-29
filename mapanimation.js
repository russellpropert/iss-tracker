import MAPBOXGL_ACCESSTOKEN from "./config.js";

//  https://open-notify-api.readthedocs.io/en/latest/iss_location.html
//  https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/

const coordinates = [];

let map;
let issMarker;
let geojson = {};

/* global mapboxgl */
mapboxgl.accessToken = MAPBOXGL_ACCESSTOKEN;

const getIssLocation = async () => {
  const url = 'http://api.open-notify.org/iss-now.json';
  const response = await fetch(url);
  const data = await response.json();
  coordinates.push([data.iss_position.longitude, data.iss_position.latitude]);
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
