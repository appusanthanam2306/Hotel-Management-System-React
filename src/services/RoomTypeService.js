import axios from 'axios';
const BASE_URL = '/api';

function getRoomTypes () {
  return axios.get(`${ BASE_URL }/roomTypes`);
}

function updateRoomType (roomTypeId, updatedRoomType) {
  return axios.put(`${ BASE_URL }/roomTypes/${roomTypeId}`, updatedRoomType);
}

function addRoomType (newRoomType) {
  return axios.post(`${ BASE_URL }/roomTypes`, newRoomType);
}

function deleteRoomType (roomTypeId) {
  return axios.delete(`${ BASE_URL }/roomTypes/${roomTypeId}`);
}

export default {
  addRoomType,
  getRoomTypes,
  updateRoomType,
  deleteRoomType
}
