import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getGuests () {
  return axios.get(`${ BASE_URL }/guests`);
}

function updateGuest (guestId, updatedGuest) {
  return axios.put(`${ BASE_URL }/guests/${guestId}`, updatedGuest);
}

function deleteGuest (guestId) {
  return axios.delete(`${ BASE_URL }/guests/${guestId}`);
}

function addGuest (newGuest) {
  return axios.post(`${ BASE_URL }/guests`, newGuest);
}

export default {
  getGuests,
  updateGuest,
  deleteGuest,
  addGuest
}