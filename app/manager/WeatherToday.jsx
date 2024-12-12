"use client";
import { set } from 'rsuite/esm/internals/utils/date';
import weatherStyles from '../WeatherComponent/weather.module.css';
import React, { useState, useEffect } from 'react';

/**
 * WeatherToday - A React component that displays the current weather for a default city ("College Station").
 * The component provides temperature, weather description, and precipitation details. 
 * It also displays warnings about potential sales impact based on weather conditions.
 * 
 * Features:
 * - Automatically fetches and displays weather data for "College Station" on load.
 * - Provides a warning message if rain or snow is detected.
 * 
 * State Variables:
 * @state {object|null} weatherData - The current weather data fetched from the API.
 * @state {string|null} error - An error message to display in case of an API or other failure.
 */
const WeatherToday = () => {
  
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
   * Runs once on component load to fetch weather data for the default city ("College Station").
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
   * Determines the precipitation (rain or snow) based on the weather data.
   * Returns the precipitation amount or "No data" if unavailable.
   * 
   * @returns {string} - The precipitation amount or "No data".
   */
  const getPrecipitation = () => {
    if (weatherData) {
      if (weatherData.rain) {
        setPrecipitation([{type: 'Rain', perc: weatherData.rain['1h']}]);
        return weatherData.rain['1h'] ||  'No data';
      } else if (weatherData.snow) {
        setPrecipitation([{type: 'Snow', perc: weatherData.snow['1h']}]);
        return weatherData.snow['1h'] || 'No data';
      }
    }
    return 'No data';
  };

  // Display only error message if there is an error
  if (error) {
    return <p className={weatherStyles.para}>Error: {error}</p>;
  }

  /**
   * Renders the weather information or warnings based on current weather conditions.
   */
  return (
    <div className={weatherStyles.Wrapper}>
      <h1 className={weatherStyles.head1}>Current Weather</h1>
      {weatherData && (
        <div className={weatherStyles.weatherInfo}>
          <h2 className={weatherStyles.head2}>{weatherData.name}</h2>
          <img
            className={weatherStyles.icon}
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <p className={weatherStyles.para}>
            Temperature: {weatherData.main ? weatherData.main.temp : 'No data'}°F
          </p>
          <p className={weatherStyles.para}>
            Weather: {weatherData.weather ? weatherData.weather[0].description : 'No data'}
          </p>
          {weatherData.rain || weatherData.snow ? (
            <p className={weatherStyles.warning}>
              Warning: Expect less sales at the moment due to {weatherData.rain ? 'rain' : 'snow'}.
            </p>
          ) : (
            <p className={weatherStyles.normal}>The weather is clear. Expect normal sales.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherToday;