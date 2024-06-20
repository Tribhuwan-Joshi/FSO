import axios from "axios";
const baseUrl = "/api";

const getContacts = () => {
  return axios.get(`${baseUrl}/persons`).then((res) => {
    return res.data;
  });
};

const createContact = (newPerson) => {
  return axios.post(`${baseUrl}/persons`, newPerson).then((res) => res.data);
};
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/info/${id}`).then((res) => res.data);
};

const updateContact = (id, newPerson) => {
  return axios.put(`${baseUrl}/info/${id}`, newPerson).then((res) => res.data);
};

export default { updateContact, getContacts, deletePerson, createContact };
