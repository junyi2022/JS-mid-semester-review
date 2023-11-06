import { initializeMap } from './map.js';
import { initializeList } from './list.js';
import { initializeSearch } from './search.js';

// get json from url
const stationInfoResp = await fetch('https://gbfs.bcycle.com/bcycle_indego/station_information.json')
const stationInfo = await stationInfoResp.json();

const events = new EventTarget(); // events object here is the event bus

const map = initializeMap(stationInfo, events); // pass event bus to each of the initialize function, so if event is fired in searchbox, map can listen to that event
initializeList(stationInfo, events);
initializeSearch(stationInfo, events);

function handleGeolocationSuccess(pos) {
  console.log(pos);

  const newEvent = new CustomEvent('geolocated', { detail: pos });
  events.dispatchEvent(newEvent);
}

function handleGeolocationError(err) {
  console.log(err);
}

navigator.geolocation.getCurrentPosition(
  handleGeolocationSuccess,
  handleGeolocationError);

window.map = map;
