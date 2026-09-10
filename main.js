const API_KEY = 'e0fa0a9217c9cb0202093dc21c539a5e'; 

// State variables
let currentWeatherData = null;
let isCelsius = true;

// DOM Elements 
const form = document.getElementById('search-form');
const input = document.getElementById('location-input');
const loading = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const locName = document.getElementById('location-name');
const condition = document.getElementById('weather-condition');
const tempDisplay = document.getElementById('temperature');
const unitToggle = document.getElementById('unit-toggle');
const weatherIcon = document.getElementById('weather-icon'); // Added here

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`, { mode: 'cors' });
        
        if (response.status === 401) {
            throw new Error("Invalid API Key. If you just created it, please wait up to 2 hours for activation.");
        }
        if (!response.ok) {
            throw new Error(`Location "${location}" not found.`);
        }
        
        const rawData = await response.json();
        console.log("Raw OpenWeatherMap Data:", rawData); 
        
        return processWeatherData(rawData);
    } catch (error) {
        console.error(error);
        alert(error.message);
        return null;
    }
}

function processWeatherData(data) {
    const processedData = {
        address: data.name,
        conditions: data.weather[0].description,
        tempC: data.main.temp,
        tempF: (data.main.temp * 9/5) + 32, 
        icon: data.weather[0].icon
    };
    
    console.log("Processed Data:", processedData);
    return processedData;
}

function updateDOM(weatherInfo) {
    if (!weatherInfo) return;
    
    locName.textContent = weatherInfo.address;
    condition.textContent = weatherInfo.conditions;
    
    // Construct the OpenWeatherMap icon URL
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`;
    
    updateTemperatureDisplay();
    
    weatherDisplay.classList.remove('hidden');
}

function updateTemperatureDisplay() {
    if (!currentWeatherData) return;
    
    if (isCelsius) {
        tempDisplay.textContent = `${Math.round(currentWeatherData.tempC)} °C`;
    } else {
        tempDisplay.textContent = `${Math.round(currentWeatherData.tempF)} °F`;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = input.value.trim();
    if (!location) return;

    weatherDisplay.classList.add('hidden');
    loading.classList.remove('hidden');

    const data = await getWeatherData(location);
    
    loading.classList.add('hidden');

    if (data) {
        currentWeatherData = data;
        updateDOM(currentWeatherData);
    }
});

unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
});