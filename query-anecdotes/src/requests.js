import axios from "axios";
const baseUrl = "http://localhost:3001/anecdotes";
export const getAnecdotes = () =>
  axios.get(baseUrl).then((res) => res.data.sort((a, b) => b.votes - a.votes));

export const createNew = (content) => {
  return axios.post(baseUrl, { content, votes: 0 }).then((res) => res.data);
};

export const updateAnecdote = (updatedAnecdote) => {
  return axios
    .put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    .then((res) => res.data);
};
