import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = () => {
  return axios.get(baseUrl).then((anecdotes) => anecdotes.data);
};

const create = (content) => {
  return axios.post(baseUrl, { content, votes: 0 }).then((res) => res.data);
};

const update = (id, payload) => {
  return axios.put(`${baseUrl}/${id}`, payload).then((res) => res.data);
};
export default { getAll, create, update };
