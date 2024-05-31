import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getContacts = () => {
  return axios.get(baseUrl).then((res) => {
    return res.data;
  });
};

const createContact = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((res) => res.data);
};
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((res) => res.data);
};

const updateContact = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson).then((res) => res.data);
};

export default { updateContact, getContacts, deletePerson, createContact };
