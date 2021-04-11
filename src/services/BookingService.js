import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getBookings () {
  return axios.get(`${ BASE_URL }/bookings`);
}

function getPastBookings (params) {
  return axios.get(`${ BASE_URL }/bookings/pastBookings`, { params });
}

function getFutureBookings (params) {
  return axios.get(`${ BASE_URL }/bookings/futureBookings`, { params });
}

function addBooking (bookingDetails) {
  return axios.post(`${ BASE_URL }/bookings/createBooking`, bookingDetails);
}

function getAvailableRooms (payload) {
  return axios.post(`${ BASE_URL }/bookings/checkAvailableRooms`, payload);
}

export default {
  getBookings,
  getPastBookings,
  getFutureBookings,
  addBooking,
  getAvailableRooms
}