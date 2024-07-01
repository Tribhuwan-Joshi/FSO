import axios from "axios";
const baseUrl = "/api/notes";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data).catch((err) => err);
};

const remove = (id) => {
  console.log("Called remove");
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((res) => res.data);
};

export default {
  getAll,
  remove,
  create,
  update,
};
