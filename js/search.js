function initializeSearch(stationInfo) {
  const searchBox = document.querySelector('#station-name-filter');
  searchBox.addEventListener('input', (evt) => { // have more control about what get passed in
    handleSearchBoxInput(evt);
  });
}

function handleSearchBoxInput(evt, stationInfo) {
  const searchBox = evt.target;
  const lowerCaseValue = searchBox.value.toLowerCase;

  const filterStations = []; // create a new thing instead of using station info because don't want to overwrite
  for (const station of stationInfo.data.stations) {
    if (station.name.toLowerCase().includes(lowerCaseValue)) {// make it case insensitive
      filteredStations.push(station);
    }
  }

//   const filteredStations = stationInfo.data.stations
//     .filter((station) => station.name.toLowerCase().includes(lowercaseValue));

  console.log(stationInfo);
}

export {
  initializeSearch,
};
