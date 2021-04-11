import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getRooms () {
  return axios.get(`${ BASE_URL }/rooms`);
}

function updateRoom (roomId, updatedRoom) {
  return axios.put(`${ BASE_URL }/rooms/${roomId}`, updatedRoom);
}

function addRoom (newRoom) {
  return axios.post(`${ BASE_URL }/rooms`, newRoom);
}

function deleteRoom (roomId) {
  return axios.delete(`${ BASE_URL }/rooms/${roomId}`);
}

export default {
  getRooms,
  updateRoom,
  addRoom,
  deleteRoom
}