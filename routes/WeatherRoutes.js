const router=require('express').Router();
const {getWeatherInfo}=require('../controllers/WeatherController');

router.post('/get-weather-info',getWeatherInfo);

module.exports=router; 