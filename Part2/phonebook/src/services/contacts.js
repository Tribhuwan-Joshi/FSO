import axios from "axios";

const getContacts = () => {
  return axios.get("http://localhost:3001/persons").then((res) => {
    return res.data;
  });
};

const deletePerson = (id) => {
  return axios
    .delete(`http://localhost:3001/persons/${id}`)
    .then((res) => console.log(res));
};

export default { getContacts, deletePerson };
