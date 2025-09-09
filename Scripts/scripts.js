
let cityInput = document.getElementById("city-input");
let apiKey = "4e2e8b53992605fa5ca69df673c34a0b";



document.getElementById("go-btn").addEventListener("click", async event => {
    document.querySelector(".weather-app").classList.add("move-up");
    document.querySelector(".weather-card").classList.add("show");

    let city = cityInput.value;

    if(city){
        try{
            const coordinates = await getCoordinatesData(city);

            if(coordinates.length === 0){
                displayError("City not found");
                return;
            }

            let lat = coordinates[0].lat.toFixed(2);
            let lon = coordinates[0].lon.toFixed(2);

            const weatherData = await getWeatherData(lat, lon);

            if(weatherData.length === 0){
                displayError("No data found");
                return;
            }

            insertData(weather);

        }catch(error){
            console.error(error);
            displayError(error);
        }
    }else{
        displayError("Please enter a city!");
    }
});


//THIS FETCHES COORDINATES
async function getCoordinatesData(city){
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

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

}

//API WORK

//GEOCODE

//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric

//http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}
