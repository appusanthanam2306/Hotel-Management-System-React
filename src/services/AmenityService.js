import axios from 'axios';
const BASE_URL = 'https://hotel-management-system-node.herokuapp.com';

function getAmenities () {
  return axios.get(`${ BASE_URL }/amenities`);
}

function updateAmenity (amenityId, updatedAmenity) {
  return axios.put(`${ BASE_URL }/amenities/${amenityId}`, updatedAmenity);
}

function addAmenity (newAmenity) {
  return axios.post(`${ BASE_URL }/amenities`, newAmenity);
}

function deleteAmenity (amenityId) {
  return axios.delete(`${ BASE_URL }/amenities/${amenityId}`);
}

export default {
  getAmenities,
  updateAmenity,
  addAmenity,
  deleteAmenity
}