'use strict';

/* ================ VARIABLE ================ */

const dayOfWeek = document.querySelector('.weather--left .day'),
      date = document.querySelector('.date'),
      city = document.querySelector('.city'),
      imgState = document.querySelector('.weather--left .weather__state'),
      temperature = document.querySelector('.weather--left .temperature'),
      textState = document.querySelector('.state'),
      pressure = document.querySelector('.pressure'),
      humidity = document.querySelector('.humidity'),
      wind = document.querySelector('.wind'),
      timeline = document.querySelector('.weather__timeline'),
      input = document.querySelector('.input'),
      btnSearch = document.querySelector('.icon--search'),
      btnDeviceLoc = document.querySelector('.weather__current-location')
      ;

let timelineDays = timeline.querySelectorAll('.weather__timeline__day'),
    res;    // response of api

const apiKeys = '74b2bc7eab84c86dab9dde6f1609b9ab';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const states = {
    ash: './icons/ash.png',
    clear: './icons/clear-sky.png',
    clouds: './icons/cloud.png',
    drizzle: './icons/drizzle.png',
    dust: './icons/sandstorm.png',
    fog: './icons/fog.png',
    haze: './icons/haze.png',
    mist: './icons/mist.png',
    sand: './icons/sand.png',
    smoke: './icons/carbon-dioxide.png',
    snow: './icons/snowy.png',
    squall: './icons/squall.png',
    sun: './icons/sun.png',
    rain: './icons/rain.png', 
    thunderstorm: './icons/thunderstorm.png',
    tornado: './icons/tornado.png'
}

/* ================ UTILITY ================ */

const init = () => {
    input.value = '';
}

/* ================ HANDLE EVENT ================ */

const editWeatherDetails = function(id) {
    const weatherToday = res.list[id];
    // Get yyyy-mm-dd and reformat to dd, mm, yyyy
    const dateData = res.list[id].dt_txt.split(' ')[0].split('-');
    
    // Day of week
    dayOfWeek.textContent = weekdays[new Date(res.list[id].dt_txt).getDay()];
    
    // day, month year
    date.textContent = `${dateData[2]}, ${months[dateData[1].replace(/^0/, '')]} ${dateData[0]}`;
    
    imgState.src = states[weatherToday.weather[0].main.toLowerCase()];
    temperature.innerHTML = `${Math.trunc(weatherToday.main.temp - 270)}<span class="text text--small unit">℃</span>`;
    textState.textContent = weatherToday.weather[0].description;
    
    pressure.textContent = `${weatherToday.main.pressure} Pa`;
    humidity.textContent = `${weatherToday.main.humidity}%`;
    wind.textContent = `${weatherToday.wind.speed} km/h`;
}

const getWeatherData = async function(e) {
    try {
        // If 'enter' key || hit search icon then implements fecth api 
        if(e.target.classList.contains('input') && e.key !== 'Enter')   return;
        
        // Get value from input
        const cityInput = input.value.trim().toLowerCase();
        
        const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKeys}`);
        
        if(!weatherData.ok) throw new Error('Get data failure !');
        res = await weatherData.json();
        // console.log(res);

        // city and country
        city.innerHTML = `${res.city.name} <span class="text text--mini country">${res.city.country}</span>`;
        
        // Change all value relate location, 0 stand for today
        editWeatherDetails(0);
        // Weather in 4 day
        timeline.innerHTML = '';
        for(let i = 0; i <= 24; i += 8) {
            timeline.insertAdjacentHTML('beforeend', `
                <div class="weather__timeline__day ${!i && 'weather__timeline__day--active'}" data-idx="${i}">
                    <img src="${states[res.list[i].weather[0].main.toLowerCase()]}" alt="" class="icon icon--small weather__state">
                    <p class="text text--mini day">${weekdays[(new Date(res.list[i].dt_txt).getDay()) % 8].slice(0, 3)}</p>
                    <p class="text text--bold text--small temperature">
                        ${Math.trunc(res.list[i].main.temp - 270)}<span class="text text--small unit">℃</span>
                    </p>
                    </p>
                </div>
            `);
        }

        // Reset timeline day when query new location
        timelineDays = timeline.querySelectorAll('.weather__timeline__day');
    } catch (err) {
        console.error(`ERR: ${err.message}`);
    }
}

const changeWeatherByDay = function(e) {

    // display target day clicked by user
    const targetDay = e.target.closest('.weather__timeline__day');
    // If click into space between divs then return
    if(!targetDay)  return;
    timelineDays.forEach(tld => tld.classList.remove('weather__timeline__day--active'));
    targetDay.classList.add('weather__timeline__day--active');

    const id = targetDay.dataset.idx;
    editWeatherDetails(id);
}

timeline.addEventListener('click', changeWeatherByDay);
input.addEventListener('keyup', getWeatherData);
btnSearch.addEventListener('click', getWeatherData);
window.addEventListener('load', init);