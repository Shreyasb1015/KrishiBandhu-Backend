const APIResponse = require('../utils/APIResponse')
const getWeatherByCity = require('../utils/weatherInfo')

const getWeatherInfo = async (req, res) => {
    try {
        // Get city from query parameters instead of body
        const city = req.query.city;
        
        if (!city) {
            return res.status(400).json(new APIResponse(null, "City parameter is required").toJson());
        }
        
        const weatherInfo = await getWeatherByCity(city);
        
        if (weatherInfo.error) {
            return res.status(400).json(new APIResponse(null, weatherInfo.error).toJson());
        }
        
        return res.status(200).json(new APIResponse(weatherInfo, null).toJson());
        
    } catch (error) {
        return res.status(500).json(new APIResponse(null, error.message).toJson());
    }
}

module.exports = { getWeatherInfo }
