import { fetchWeather } from "./weather"
import ICON_MAP from "./weatherIconMap";
import {fetchCoOrdinates, fetchLocationName} from "./geoCoding";

// Intl.DateTimeFormat().resolvedOptions().timeZone

function reloadPage(){
    window.location.reload();
}

let locationData = null;
let data = null;

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined,{hour : "numeric"});
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined,{weekday:"long"});

// ================= Fetch Weather Info By Accessing Location =================

navigator.geolocation.getCurrentPosition(success, error);

async function success({coords}){
    const latitude = coords.latitude;
    const longitude = coords.longitude;
    try{
        const locationName = await fetchLocationName(latitude, longitude);
        data = await fetchWeather(latitude, longitude);
        const locationData = {
            latitude,
            longitude,
            name : locationName
        }
        bindLocationInfo(locationData);
        renderWeather(data);
    }catch(e){
        alert('Something went wrong !!!');
    }
    
}

function error(){
    alert('There was an error getting your location. Please allow us to use your location and refresh the page.');
}

// ================= Fetch Weather Info By Search option =================

const searchQuery = document.getElementById('searchField');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click',()=>{
    const query = searchQuery.value;
    window.scrollTo(0,0);
    if(query){
        document.getElementById('main').classList.add('blurred');
        searchWeatherByLocation(query);
        searchQuery.value='';
    }
    else{
        return;
    }
})


async function searchWeatherByLocation(locationName){
    try{
    locationData = await fetchCoOrdinates(locationName);
    data = await fetchWeather(locationData.latitude, locationData.longitude);
    renderWeather(data);
    bindLocationInfo(locationData);
}catch(e){
    alert('Error getting weather');
}

}


function getWeatherIconUrl(iconCode){
    return `/icons/${ICON_MAP.get(iconCode)}.svg`;
}

function  setValue(selector, value, {parent = document} = {}){
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

function bindLocationInfo({name, latitude, longitude}){
    setValue('location-name',name);
    setValue('location-lat', parseFloat(latitude).toFixed(3));
    setValue('location-lon', parseFloat(longitude).toFixed(3));
}



function bindCurrentWeatherData({currentTemp, high, low, flHigh, flLow, precip, windSpeed, iconCode}){
    const currentWeatherIcon = document.querySelector('[data-current-weather-icon]');
    currentWeatherIcon.src = getWeatherIconUrl(iconCode);
    setValue('current-temp', currentTemp);
    setValue('current-high', high);
    setValue('current-fl_high', flHigh);
    setValue('current-low', low);
    setValue('current-fl_low', flLow);
    setValue('current-wind', windSpeed);
    setValue('current-precip', precip);
}

// const DAY_FORMATTER = new Intl.DateTimeFormat(undefined,{weekday:"long"});

function bindDailyWeatherData(daily){
    const daySection = document.querySelector('[data-day-section]');
    const dayTemplate = document.getElementById('day-template');

    daySection.innerHTML='';

    daily.forEach(day =>{
        const cloneDayTemp = dayTemplate.content.cloneNode(true);
        setValue('day-card-name', DAY_FORMATTER.format(day.timeStamp), {parent : cloneDayTemp});
        setValue('day-card-temp', day.dayMaxTemp, {parent : cloneDayTemp});
        cloneDayTemp.querySelector('[data-day-card-icon]').src = getWeatherIconUrl(day.dayIconCode);

        daySection.appendChild(cloneDayTemp);
    })
}

// const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined,{hour : "numeric"});

function hourlyWeatherData(hour){
    const hourSection = document.querySelector('[data-hour-section]');
    const hourRowTemp = document.getElementById('hour-row-template');

    hourSection.innerHTML = '';

    hour.forEach(hour => {
       const hourRowClone = hourRowTemp.content.cloneNode(true);
        const parent = {
            parent : hourRowClone
        }

       setValue('day-name', DAY_FORMATTER.format(hour.timeStamp), parent);
       setValue('day-time', HOUR_FORMATTER.format(hour.timeStamp), parent);
       hourRowClone.querySelector('[data-hour-icon]').src = getWeatherIconUrl(hour.hourlyIconCode);
       setValue('hour-temp', hour.hourlyTemp, parent);
       setValue('hour-fl-temp', hour.hourlyFlTemp, parent);
       setValue('hour-wind', hour.wind, parent);
       setValue('hour-precip', hour.precip, parent);

       hourSection.appendChild(hourRowClone);
    })
}

function renderWeather({currentWeather : current , dailyWeather : daily, hourlyWeather : hour}){
    bindCurrentWeatherData(current);
    bindDailyWeatherData(daily);
    hourlyWeatherData(hour);
    document.getElementById('main').classList.remove('blurred');
}

