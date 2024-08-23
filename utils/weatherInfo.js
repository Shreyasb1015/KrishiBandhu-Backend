const axios =require('axios');

const WEATHER_API_KEY=process.env.WEATHER_API_KEY;



async function getWeatherByCity(city) {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric' 
        }
      });
  
      const data = response.data;
  
      const weatherInfo = {
        location: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility,
        cloudiness: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(), 
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString() 
      };
  
      return weatherInfo;
    } catch (error) {
      console.error(`Error fetching weather data: ${error.message}`);
      return { error: error.response ? error.response.data.message : error.message };
    }
  }
  
  module.exports = getWeatherByCity;
  