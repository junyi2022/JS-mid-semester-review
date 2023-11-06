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

  events.addEventListener('geolocated', (evt) => {
    // This listener will zoom to contain the three nearest stations to the
    // user's current position.

    const pos = evt.detail;
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // Create a turf point from the user's position.
    const userPoint = turf.point([lon, lat]);

    // Create a comparison function for sorting stations by their distance from
    // the users position.
    function compareDists(stationA, stationB) {
      const stationAPoint = turf.point([stationA.lon, stationA.lat]);
      const distA = turf.distance(userPoint, stationAPoint);
      const stationBPoint = turf.point([stationB.lon, stationB.lat]);
      const distB = turf.distance(userPoint, stationBPoint);

      return distA - distB;
    }

    // Make a copy of the stations array with the slice function, and sort it.
    // We make a copy first here because the JS array sort function sorts the
    // array in place, rather than returning a new array, and we want to keep
    // the original stations array unchanged.
    const sortedStations = stationInfo.data.stations.slice();
    sortedStations.sort(compareDists);

    // Get the three closest stations from the sorted array, and use the map
    // function to create a multipoint containing the coordinates of those
    // stations.
    const closestStations = sortedStations.slice(0, 3);
    const closestPoints = turf.multiPoint(closestStations.map((station) => [station.lon, station.lat]));

    // Get the bounding box around the closest points. Turf will return this in
    // an array of [minX, minY, maxX, maxY], so we have to convert that to a
    // form that Leaflet is happy with (a LatLngBounds) by flipping around the X
    // and Y (longitude and latitude) components.
    const bbox = turf.bbox(closestPoints);
    const leafletBbox = L.latLngBounds([bbox[1], bbox[0]], [bbox[3], bbox[2]]);

    // Finally, fit the map view to the stations.
    map.fitBounds(leafletBbox);
  });

  events.addEventListener('focus-station', (evt) => {
    const stationId = evt.detail.stationId;
    stationLayer.eachLayer((layer) => {
      if (layer.stationId === stationId) {
        layer.bindPopup('hello');
        layer.openPopup();
      }
    });
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
    marker.bindTooltip(station.name); // add tooltip, if data is geojson, use a function like: (m) => m.feature.properties.name)
    marker.bindPopup(`
      <h2 class="station-name">${station.name}</h2>
      <p class="station-address">${station.address}</p>
    `); // add popup box
    marker.stationId = station.station_id;
    marker.addTo(stationLayer);
  };
}

export {
  initializeMap,
};
