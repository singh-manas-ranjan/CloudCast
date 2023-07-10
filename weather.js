import axios from "axios";

// https://api.open-meteo.com/v1/forecast?latitude=12.9719&longitude=77.5937&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_80m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=auto



export async function fetchWeather(lat, long){
   const data = await axios.get('https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=auto',{
        params: {
            latitude: lat,
            longitude: long,
        }
    })

    // return data;

    const parseCurrentWeather = ({data:{current_weather: currentWeatherData, daily}}) => {

        const {temperature: currentTemp,
             windspeed: windSpeed, 
             weathercode: iconCode} = currentWeatherData;

        const {
            temperature_2m_max : [high],
            temperature_2m_min : [low],
            apparent_temperature_max : [flHigh],
            apparent_temperature_min : [flLow],
            precipitation_sum : [precip] } = daily;

        return {
            currentTemp : Math.round(currentTemp),
            high : Math.round(high),
            low : Math.round(low),
            flHigh : Math.round(flHigh),
            flLow : Math.round(flLow),
            windSpeed : Math.round(windSpeed),
            precip : Math.round(precip * 100) / 100,
            iconCode
        }
    }
    const parseDailyWeather = ({data:{daily}}) => {
         return daily.time.map((time, index)=>{
           return{
            timeStamp: time * 1000,
            dayIconCode: daily.weathercode[index],
            dayMaxTemp: Math.round(daily.temperature_2m_max[index])
           }
        })
    }
    const parseHourlyWeather = ({data:{hourly, current_weather}}) => {
        return hourly.time.map((time,index)=>{
            return{
                timeStamp: time * 1000,
                hourlyIconCode: hourly.weathercode[index],
                hourlyTemp: Math.round(hourly.temperature_2m[index]),
                hourlyFlTemp: Math.round(hourly.apparent_temperature[index]),
                wind: Math.round(hourly.windspeed_10m[index]),
                precip: hourly.precipitation[index]
            }
        }).filter(({timeStamp})=> timeStamp >= current_weather.time * 1000)
    }

    return {
        currentWeather: parseCurrentWeather(data),
        dailyWeather: parseDailyWeather(data),
        hourlyWeather: parseHourlyWeather(data)
    }
}