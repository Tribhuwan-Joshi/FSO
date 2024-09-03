import { useEffect } from "react";
import { useState } from "react";
import utils from "./services/utils";
import CountryInfo from "./components/CountryInfo";
const App = () => {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (country)
      utils
        .getCountryData()
        .then((res) =>
          setCountries(
            res.filter((r) => r.name.common.toLowerCase().startsWith(country))
          )
        )
        .catch((err) => {
          setError(err.message);
          setTimeout(() => setError(""), 5000);
        });
    else setCountries([]);
  }, [country]);

  useEffect(() => {
    if (countries.length == 1) {
      utils
        .getWeather(countries[0].name.common)
        .then((res) => {
          setWeatherData(res);
        })
        .catch((err) => {
          setError(err.message);
          setTimeout(() => setError(""), 5000);
        });
    }
  }, [countries]);

  const countryChange = (e) => {
    const val = e.target.value;
    setCountry(val);
  };

  const showCountry = (name) => {
    setCountries(countries.filter((i) => i.name.common == name));
  };
  return (
    <>
      {error && (
        <div
          style={{
            color: "red",
            padding: 10,
            border: "2px solid red",
            backgroundColor: "lightgray",
          }}
        >
          {error}
        </div>
      )}
      <label htmlFor="country">Find Country</label>
      <input id="country" value={country} onChange={countryChange} />
      <div>
        {countries &&
          (countries.length > 10 ? (
            "Too many matches, specifies another filter"
          ) : countries.length == 1 && Object.keys(weatherData).length ? (
            <CountryInfo data={countries[0]} weatherData={weatherData} />
          ) : (
            <ul>
              {countries.map((c) => (
                <li key={c.name.common}>
                  {c.name.common}{" "}
                  <button onClick={() => showCountry(c.name.common)}>
                    show
                  </button>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </>
  );
};

export default App;
