const router=require('express').Router();
const {getWeatherInfo}=require('../controllers/WeatherController');
const verifyToken = require('../middlewares/UserMiddleware')
router.get('/get-weather-info',verifyToken,getWeatherInfo);

module.exports=router; 