import { initializeMap } from './map.js';
import { initializeSearch } from './search.js';

// get json from url
const stationInfoResp = await fetch('https://gbfs.bcycle.com/bcycle_indego/station_information.json')
const stationInfo = await stationInfoResp.json();

const events = new EventTarget;

initializeMap(stationInfo);
initializeSearch(stationInfo);
