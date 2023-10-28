function initializeMap(stationInfo, events) {
  const map = L.map('map').setView([39.95, -75.16], 12);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v12',
    accessToken: 'pk.eyJ1IjoianVueWl5IiwiYSI6ImNsbXMza292bjAxcXoybG1meHhuZ3N1cjYifQ.EYo5VECxk9-NCAEgc3dm9w',
  }).addTo(map);

  // console.log(stationInfo); // way to figue out what is inside the json
  const stationLayer = L.layerGroup();
  stationLayer.addTo(map);

  updateMapStations(stationInfo.data.stations, stationLayer);

  events.addEventListener('filter-stations', (evt) => {
    const filteredStations = evt.detail.filteredStations;
    updateMapStations(filteredStations, stationLayer);
  });

  return map;
}

function updateMapStations(stations, stationLayer) {
  console.log(`Adding ${stations.length} stations to the map.`);
  stationLayer.clearLayers(); // clear pins before adding new ones
  const stationIcon = L.icon({
    iconUrl: 'images/station-marker.png',
    iconSize: [22, 31.5], // size of the icon
    iconAnchor: [11, 31.5], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });

  // to import station json
  for (const station of stations) {
    // console.log(station); // good way to see what you are working with in the console
    const marker = L.marker([station.lat, station.lon], {
      alt: station.name, // for accessibility reader
      icon: stationIcon, // add customize icon
    });
    marker.bindTooltip(station.name); // add tooltip, if data is geojson, use a function like: (m) => m.feature.properties,name)
    marker.bindPopup(`
      <h2 class="station-name">${station.name}</h2>
      <p class="station-address">${station.address}</p>
    `); // add popup box
    marker.addTo(stationLayer);
  };
}

export {
  initializeMap,
};
