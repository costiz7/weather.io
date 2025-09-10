
let cityInput = document.getElementById("city-input");
let apiKey = "4e2e8b53992605fa5ca69df673c34a0b";

document.getElementById("go-btn").addEventListener("click", async event => {

    let city = cityInput.value;

    if(city){
        try{
            const coordinates = await getCoordinatesData(city);

            if(coordinates.length === 0){
                displayError("City not found");
                return;
            }
            let cityName = coordinates[0].name;
            let lat = coordinates[0].lat;
            let lon = coordinates[0].lon;

            const weatherData = await getWeatherData(lat, lon);

            if(weatherData.length === 0){
                displayError("No data found");
                return;
            }

            insertData(weatherData, cityName);

            cityInput.value = '';

            document.querySelector(".weather-app").classList.add("move-up");
            document.querySelector(".weather-card").classList.add("show");

        }catch(error){
            console.error(error);
            displayError(error);
        }
    }else{
        displayError("Please enter a city");
    }
});

function insertData(weather, cityName){
    let countryName = weather.sys.country;
    let wType = weather.weather[0].main;
    let iconCode = weather.weather[0].icon;
    let temp = parseInt(weather.main.temp);
    let pressure = weather.main.pressure;
    let humidity = weather.main.humidity;
    let mintemp = parseInt(weather.main.temp_min);
    let maxtemp = parseInt(weather.main.temp_max);
    let windSpeed = weather.wind.speed; // m/s
    let windKmh = (windSpeed * 3.6).toFixed(1);
    let direction = formatWindDirection(weather.wind.deg);
    let rain;
    if(weather.rain && weather.rain["1h"]){
        rain = weather.rain["1h"];
    } else{
        rain = 0;
    }

    let snow;
    if(weather.snow && weather.snow["1h"]){
        snow = weather.snow["1h"];
    } else{
        snow = 0;
    }

    let cloud = weather.clouds.all;

    document.querySelector(".weather-card").innerHTML = `
    <div class="titleWrapper">
    <div class="wTitle">
        <span class="city">${cityName}&nbsp&nbsp&nbsp&#9135</span>
        <span class="country">&nbsp&nbsp&nbsp${countryName}</span>
    </div>
</div>
<div class="info-wrap">
    <div class="main-info">
        <div class="first-half">
            <span class="wType">${wType}</span>
            <img class="wIcon" src="./Assets/day-icons/${iconCode}.png" alt="${wType}">
            <span class="wTemp">${temp} °C</span>
        </div>
        <div class="second-half">
            <span class="wPress">Pressure: ${pressure} mb</span>
            <span class="wHum">Humidity: ${humidity}%</span>
            <div class="minTemp">
                <span class="wMinH">MIN</span>
                <span class="wMinT">${mintemp} °C</span>
            </div>
            <div class="maxTemp">
                <span class="wMaxH">MAX</span>
                <span class="wMaxT">${maxtemp} °C</span>
            </div>
        </div>
    </div>
    <div class="sec-info">
        <div class="card-wrap">
            <div class="wWind">
                <div class="windH-contain">
                    <span class="windH">Wind</span>
                </div>
                <span class="windSpeed">${windKmh} Km/h</span>
                <span class="windDir">${direction}</span>
            </div>
        </div>
        <div class="card-wrap">
            <div class="wRS">
                <div class="RSH-contain">
                    <span class="RSH">Rain & Snow</span>
                </div>
                <div class="prec">
                    <img src="./Assets/drop.png" alt="drop">
                    <span class="precQ">${rain} mm/h</span>
                </div>
                <div class="snow">
                    <img src="./Assets/snow.png" alt="snow">
                    <span class="snowQ">${snow} mm/h</span>
                </div>

            </div>
        </div>
        <div class="card-wrap">
            <div class="wClouds">
                <div class="wCloudH-contain">
                    <span class="wCloudH">Cloudiness</span>
                </div>
                <span class="cloudPercent">${cloud} %</span>
            </div>
        </div>

    </div>
</div>
    `;
}

function formatWindDirection(deg) {
    const directions = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}

//THIS FETCHES COORDINATES
async function getCoordinatesData(city){
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not fetch coordinates");
    }

    return await response.json();
}

async function getWeatherData(lat, lon){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not find fetch data");
    }

    return await response.json();
}

function displayError(message){
    document.querySelector(".weather-card").innerHTML = `
    <div class="errorDisplay">
        <p>${message}</p>
    </div>
    `;

}