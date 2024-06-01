import axios from "axios";
const apiKey = import.meta.env.VITE_SOME_KEY;
function getCountryData() {
  return axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then((res) => res.data);
}

function getWeather(name) {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`
    )
    .then((res) => res.data);
}
export default { getCountryData, getWeather };
