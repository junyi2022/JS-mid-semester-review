function initializeSearch(stationInfo, events) {
  const searchBox = document.querySelector('#station-name-filter');
  searchBox.addEventListener('input', (evt) => { // have more control about what get passed in, can add inputs in the ()
    handleSearchBoxInput(evt, stationInfo, events);
  });
}

// event handler
function handleSearchBoxInput(evt, stationInfo, events) {
  updateFilteredStations(stationInfo, events);
}

function updateFilteredStations(stationInfo, events) {
  const searchBox = document.querySelector('#station-name-filter');
  const lowerCaseValue = searchBox.value.toLowerCase(); // .value is another attribute for input element. Other attributes like "checked" for checkbox

  const filteredStations = []; // create a new thing instead of using station info to filter because don't want to overwrite
  for (const station of stationInfo.data.stations) {
    if (station.name.toLowerCase().includes(lowerCaseValue)) {// make it case insensitive
      filteredStations.push(station);
    }
  }

  // another way of doing the filter
  //   const filteredStations = stationInfo.data.stations
  //     .filter((station) => station.name.toLowerCase().includes(lowercaseValue));

  const newEvent = new CustomEvent('filter-stations', { detail: { filteredStations }}); // define your own event
  events.dispatchEvent(newEvent);
}

export {
  initializeSearch,
};
