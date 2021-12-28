// select html elements
let inputEl = document.querySelector('#city-input')
let submitBtn = document.querySelector('#submit-button');
let cityNameEl = document.querySelector('#city-name')
let currentTempEl = document.querySelector('#temp')
let currentWindEl = document.querySelector('#wind')
let currentHumidityEl = document.querySelector('#humidity')
let currentUVEl = document.querySelector('#uv')

let currentDate = moment().format('l');
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial&q=';

var getWeatherData = function(city) {
    fetch(baseURL + city)
    .then(function(response) {
        response.json()
        .then(function(data) {
            console.log(data);
            cityNameEl.textContent = data.name + `(${currentDate})`;
            let iconURL = data.weather[0].icon
            let iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconURL + '@2x.png')
            cityNameEl.appendChild(iconEl);
            currentTempEl.textContent = 'Temp: ' + data.main.temp + '\xB0F';
            currentWindEl.textContent = 'Wind: ' + data.wind.speed + ' MPH';
            currentHumidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial`)
            .then(function(response) {
                response.json()
                .then(function(data) {
                    console.log(data);
                    let uvIndex = data.current.uvi;
                    currentUVEl.textContent = 'UV Index: ' + uvIndex;
                    if (uvIndex <= 2) {
                        currentUVEl.style.backgroundColor = 'green';
                    } else if (uvIndex <= 6) {
                        currentUVEl.style.backgroundColor = 'yellow';
                    } else {
                        currentUVEl.style.backgroundColor = 'red';
                    }
                    ;
                })
            })
        })
    })
};

submitBtn.addEventListener('click', function() {
    event.preventDefault();
    
    getWeatherData(inputEl.value);
})

