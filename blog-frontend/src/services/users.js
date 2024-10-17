import axios from "axios";
const baseUrl = "/api/users";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const signup = async ({ username, name, password }) => {
  const res = await axios.post(baseUrl, { username, name, password });
  return res;
};

export default { getAll, signup };
