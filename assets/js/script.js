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
let fiveDayURL = ''

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
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial&exclude=minutely,hourly,alerts`)
            .then(function(response) {
                response.json()
                .then(function(data) {
                    console.log(data);
                    let uvIndex = data.current.uvi;
                    currentUVEl.textContent = 'UV Index: ' + uvIndex;
                    if (uvIndex <= 3) {
                        currentUVEl.style.backgroundColor = 'green';
                    } else if (uvIndex <= 6) {
                        currentUVEl.style.backgroundColor = 'yellow';
                    } else if (uvIndex <=8) {
                        currentUVEl.style.backgroundColor = 'orange';
                    } else if (uvIndex <= 11) {
                        currentUVEl.style.backgroundColor = 'red';
                    } else {
                        currentUVEl.style.backgroundColor = 'purple';
                    };
                    let cardOneEl = document.querySelector('#day-one');
                    
                    let dateEl = document.createElement('li');
                    dateEl.textContent = 'DATE';
                    cardOneEl.appendChild(dateEl);

                    let iconEl = document.createElement('img');
                    let iconCode = data.daily[1].weather[0].icon;
                    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}@2x.png`)
                    cardOneEl.appendChild(iconEl);

                    let tempEl = document.createElement('li');
                    tempEl.textContent = 'Temp: ' + data.daily[1].temp.day + '\xB0F';
                    cardOneEl.appendChild(tempEl);

                    let windEl = document.createElement('li');
                    windEl.textContent = 'Wind: ' + data.daily[1].wind_speed + 'MPH';
                    cardOneEl.appendChild(windEl);

                    let humidityEl = document.createElement('li');
                    humidityEl.textContent = 'Humidity: ' + data.daily[1].humidity + ' %';
                    cardOneEl.appendChild(humidityEl);
                })
            })
        })
    })
};

submitBtn.addEventListener('click', function() {
    event.preventDefault();
    
    getWeatherData(inputEl.value);
})

