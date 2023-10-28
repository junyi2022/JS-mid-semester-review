import { initializeMap } from './map.js';
import { initializeSearch } from './search.js';

// get json from url
const stationInfoResp = await fetch('https://gbfs.bcycle.com/bcycle_indego/station_information.json')
const stationInfo = await stationInfoResp.json();

const events = new EventTarget(); // events object here is the event bus

initializeMap(stationInfo, events); // pass event bus to each of the initialize function, so if event is fired in searchbox, map can listen to that event
initializeSearch(stationInfo, events);
