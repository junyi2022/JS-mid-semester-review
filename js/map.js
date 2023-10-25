function initializeMap(stationInfo) {
  const map = L.map('map').setView([39.95, -75.16], 12);

  L.tileLayer('https://api.mapbox.com/styles/v1/junyiy/clnm30x5u004101p71nocglgj/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianVueWl5IiwiYSI6ImNsbXMza292bjAxcXoybG1meHhuZ3N1cjYifQ.EYo5VECxk9-NCAEgc3dm9w', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // console.log(stationInfo); // way to figue out what is inside the json
  const stationLayer = L.layerGroup();
  stationLayer.addTo(map);

  const stationIcon = L.icon({
    iconUrl: 'images/station-marker.png',
    iconSize: [22, 31.5], // size of the icon
    iconAnchor: [11, 31.5], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });

  for (const station of stationInfo.data.stations) {
    console.log(station);
    const marker = L.marker([station.lat, station.lon], {
      alt: station.name, // for accessibility reader
      icon: stationIcon,
    });
    marker.bindTooltip(station.name); // add tooltip
    marker.bindPopup(`
      <h2 class="station-name">${station.name}</h2>
      <p class="station-address">${station.address}</p>
    `);
    marker.addTo(stationLayer);
  };

  return map;
}

export {
  initializeMap,
};
