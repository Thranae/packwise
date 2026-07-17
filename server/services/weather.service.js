import axios from 'axios';

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  }

  async getCoordinates(destination) {
    try {
      const response = await axios.get(this.geoUrl, {
        params: {
          q: destination,
          limit: 1,
          appid: this.apiKey
        }
      });
      
      if (!response.data || response.data.length === 0) {
        // Fallback: If "Tokyo & Kyoto Explorer" fails, try just the first primary word
        const firstWord = destination.split(/[\s,&]+/).find(w => w.length > 2);
        if (firstWord && firstWord !== destination) {
          console.log(`[Weather] Full destination failed, trying fallback: ${firstWord}`);
          const fallbackRes = await axios.get(this.geoUrl, {
            params: { q: firstWord, limit: 1, appid: this.apiKey }
          });
          if (fallbackRes.data && fallbackRes.data.length > 0) {
            return { lat: fallbackRes.data[0].lat, lon: fallbackRes.data[0].lon };
          }
        }
        throw new Error(`Location not found: ${destination}`);
      }
      
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon
      };
    } catch (error) {
      console.error('Error in getCoordinates:', error.message);
      throw error;
    }
  }

  async getWeather(destination) {
    try {
      this.apiKey = process.env.OPENWEATHER_API_KEY;
      if (!this.apiKey) {
        throw new Error('OpenWeather API Key is missing');
      }

      const { lat, lon } = await this.getCoordinates(destination);

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${this.baseUrl}/weather`, {
          params: { lat, lon, appid: this.apiKey, units: 'metric' }
        }),
        axios.get(`${this.baseUrl}/forecast`, {
          params: { lat, lon, appid: this.apiKey, units: 'metric' }
        })
      ]);

      const current = {
        temp: Math.round(currentRes.data.main.temp),
        feels_like: Math.round(currentRes.data.main.feels_like),
        condition: currentRes.data.weather[0].main,
        description: currentRes.data.weather[0].description,
        icon: currentRes.data.weather[0].icon,
        humidity: currentRes.data.main.humidity,
        wind_speed: currentRes.data.wind.speed,
        visibility: currentRes.data.visibility,
        sunrise: currentRes.data.sys.sunrise,
        sunset: currentRes.data.sys.sunset
      };

      const tzOffset = forecastRes.data.city.timezone || 0; // offset in seconds
      const dailyForecastMap = new Map();
      forecastRes.data.list.forEach(item => {
        // Shift UTC time to destination's local time
        const localTimeSec = item.dt + tzOffset;
        const dateObj = new Date(localTimeSec * 1000);
        // Use UTC string since we manually shifted the time
        const dateStr = `${dateObj.getUTCFullYear()}-${dateObj.getUTCMonth()}-${dateObj.getUTCDate()}`;
        
        if (!dailyForecastMap.has(dateStr)) {
          dailyForecastMap.set(dateStr, {
            date: item.dt,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            condition: item.weather[0].main,
            icon: item.weather[0].icon
          });
        } else {
          const existing = dailyForecastMap.get(dateStr);
          existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
          existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
        }
      });

      const forecast = Array.from(dailyForecastMap.values()).slice(0, 5).map((item, index) => {
        let label = "";
        if (index === 0) label = "Today";
        else if (index === 1) label = "Tomorrow";
        else {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = days[new Date((item.date + tzOffset) * 1000).getUTCDay()];
        }
        
        return {
          day: label,
          temp: Math.round(item.temp_max),
          min: Math.round(item.temp_min),
          condition: item.condition,
          icon: item.icon
        };
      });

      return {
        location: currentRes.data.name,
        current,
        forecast
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new WeatherService();
