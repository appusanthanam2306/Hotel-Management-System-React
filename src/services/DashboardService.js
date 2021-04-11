import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getHotelConfigurationMetrics () {
  return axios.get(`${ BASE_URL }/dashboard/hotelConfiguration`);
}

export default {
  getHotelConfigurationMetrics
}