import axios from "axios";
const baseUrl = "/api/login";

const loginUser = async ({ username, password }) => {
  const res = await axios.post(baseUrl, { username, password });
  return res;
};

export default { loginUser };
