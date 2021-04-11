import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getFloors () {
  return axios.get(`${ BASE_URL }/floors`);
}

function updateFloor (floorId, updatedFloor) {
  return axios.put(`${ BASE_URL }/floors/${floorId}`, updatedFloor);
}

function deleteFloor (floorId) {
  return axios.delete(`${ BASE_URL }/floors/${floorId}`);
}

function addFloor (newFloor) {
  return axios.post(`${ BASE_URL }/floors`, newFloor);
}

export default {
  getFloors,
  deleteFloor,
  updateFloor,
  addFloor
}