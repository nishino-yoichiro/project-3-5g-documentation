"use client";
import weatherStyles from './weather.module.css';
import React, { useState, useEffect } from 'react';

/**
 * WeatherComponent - A React component that fetches and displays current weather
 * data for a given city using an API. It includes a search bar for users to input
 * a city name and displays temperature, weather description, and precipitation information.
 *
 * Features:
 * - Displays current weather for a default city (College Station) on load.
 * - Allows users to search for weather in other cities.
 * - Handles API errors, including rate-limit errors.
 *
 * State Variables:
 * @state {string} city - The name of the city entered by the user.
 * @state {object|null} weatherData - The current weather data fetched from the API.
 * @state {string|null} error - An error message to display in case of an API or other failure.
 */
const WeatherComponent = () => {

  /**
   *@description The name of the city entered by the user.
   * @type {string}
   * @default ""
   */
  const [city, setCity] = useState("");

  /**
   * @description The weather data fetched from the API.
   * @type {object|null}
   * @default null
   */
  const [weatherData, setWeatherData] = useState(null);
  
  /**
   * @description The error message to display in case of an API or other failure.
   * @type {string|null}
   * @default null
   */
  const [error, setError] = useState(null);

  /**
   * Runs once on component load to fetch weather data for the default city, College Station.
   */
  useEffect(() => {
    getWeather("College Station"); // default city as College Station
  }, []); // Add an empty dependency array to run only once


  /**
   * Fetches weather data for the specified city using an API endpoint.
   * Updates the `weatherData` and `error` states based on the result.
   * 
   * @param {string} city_name - The name of the city to fetch weather data for.
   */
  const getWeather = async (city_name) => {
    try {
      const data = await fetch('/api/weather?city=' + city_name).then((res) => res.json());
      setWeatherData(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("You have reached the API rate limit. Try again later.");
      } else {
        setError(err.message);
      }
      setWeatherData(null); // Clear weather data on error
    }
  };

  /**
   * Handles input changes in the search bar.
   * Updates the `city` state with the new value.
   * 
   * @param {object} e - The input event object.
   */
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  /**
   * Triggers a function to fetch weather dat for the city entered by the user.
   */
  const handleGetWeather = () => {
    getWeather(city);
  };

  /**
   * Determines the precipitation (rain or snow) based on the weather data.
   * Returns "No data" if precipitation data is unavailable.
   * 
   * @returns {string} - The precipitation amount or "No data".
   */
  const getPrecipitation = () => {
    if (weatherData) {
      if (weatherData.rain) {
        return weatherData.rain['1h'] ||  'No data';
      } else if (weatherData.snow) {
        return weatherData.snow['1h'] || 'No data';
      }
    }
    return 'No data';
  };

  /**
   * Renders the weather component, including:
   * - A search bar for city input.
   * - Error messages, if any.
   * - Weather data (temperature, weather description, and precipitation).
   */
  return (
    <div className={weatherStyles.Wrapper}>
      <h1 className={weatherStyles.head1}>Current Weather</h1>
      <div className={weatherStyles.SearchBar}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Search City"
          className={weatherStyles.InputCity}
        />
        <button onClick={handleGetWeather}>Search</button>
      </div>
        {error && <p className={weatherStyles.para}>Error: {error}</p>}
        {!error && weatherData && (
          <div className={weatherStyles.weatherInfo}>
            <h2 className={weatherStyles.head2}>{weatherData.name}</h2>
            <img className={weatherStyles.icon} src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather Icon" />
            <p className={weatherStyles.para}>Temperature: {weatherData.main ? weatherData.main.temp : 'No data'}°F</p>
            <p className={weatherStyles.para}>Weather: {weatherData.weather ? weatherData.weather[0].description : 'No data'}</p>
            <p className={weatherStyles.para}>Precipitation: {getPrecipitation()}</p>
          </div>
        )}
    </div>
  );
};

export default WeatherComponent;