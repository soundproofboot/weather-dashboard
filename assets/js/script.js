// select html elements
let inputEl = document.querySelector('#city-input')
let submitBtn = document.querySelector('#submit-button');
let formEl = document.querySelector('form');

let weatherDataEl = document.querySelector('.weather-data')
let cityNameEl = document.querySelector('#city-name');
let currentStatsEl = document.querySelector('.current-stats');
let currentTempEl = document.querySelector('#temp')
let currentWindEl = document.querySelector('#wind')
let currentHumidityEl = document.querySelector('#humidity')
let currentUVEl = document.querySelector('#uv');
let fiveDay = document.querySelector('.five-day');
let searchHistoryEl = document.querySelector('.search-history');
let fiveDayHeaderEl = document.querySelector('#five-day-header');

let currentDate = moment().format('l');
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial&q=';
let fiveDayURL = ''

if (!localStorage.cities) {
    localStorage.setItem('cities', JSON.stringify([]));
};

let citiesArray = JSON.parse(localStorage.getItem('cities'));

var getWeatherData = function(city) {
    fetch(baseURL + city)
    .then(function(response) {
        response.json()
        .then(function(data) {
            console.log(data);
            if (data.message === 'city not found' || data.message === 'Nothing to geocode') {
                cityNameEl.innerHTML = `The city entered was not in the OpenWeather API list. For more info on OpenWeather API please visit <a href='https://openweathermap.org/api'>https://openweathermap.org/api</a>`
                currentStatsEl.style.display = 'none';
                fiveDayHeaderEl.style.display = 'none';
            } else {
                currentStatsEl.style.display = 'block';
                fiveDayHeaderEl.style.display = 'block';
                cityNameEl.textContent = data.name + ` (${currentDate})`;
                if (!citiesArray.includes(data.name)) {
                citiesArray.push(data.name);
                localStorage.setItem('cities', JSON.stringify(citiesArray));
                cityButtonMaker(data.name);
            }
            let iconURL = data.weather[0].icon
            let iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + iconURL + '@2x.png')
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
                    fiveDayHeaderEl.textContent = '5 Day Forecast:';
                    fiveDay.innerHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        let cardEl = document.createElement('ul');
                        cardEl.classList.add('day');
                        
                        let dateEl = document.createElement('li');
                        dateEl.textContent = moment().add(i, 'day').format('l');
                        cardEl.appendChild(dateEl);

                        let iconEl = document.createElement('img');
                        let iconCode = data.daily[i].weather[0].icon;
                        iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`)
                        cardEl.appendChild(iconEl);

                        let tempEl = document.createElement('li');
                        tempEl.textContent = 'Temp: ' + data.daily[i].temp.day + '\xB0F';
                        cardEl.appendChild(tempEl);

                        let windEl = document.createElement('li');
                        windEl.textContent = 'Wind: ' + data.daily[i].wind_speed + 'MPH';
                        cardEl.appendChild(windEl);

                        let humidityEl = document.createElement('li');
                        humidityEl.textContent = 'Humidity: ' + data.daily[i].humidity + ' %';
                        cardEl.appendChild(humidityEl);
                        fiveDay.appendChild(cardEl);
                    }
                })
            })
        }
      }
     )
    })
};

var cityButtonMaker = function(city) {
    let newButton = document.createElement('button');
    newButton.textContent = city;
    searchHistoryEl.appendChild(newButton);
    newButton.addEventListener('click', function() {
        getWeatherData(city);
    });
}

var displayHistory = function(arr) {
    for (let i = 0; i < arr.length; i++) {
        cityButtonMaker(arr[i]);
    }
}

displayHistory(citiesArray);

submitBtn.addEventListener('click', function() {
    event.preventDefault();
    if (inputEl.value === '') {
        inputEl.setAttribute('placeholder', 'Please enter a city');
        inputEl.style.backgroundColor = 'pink';
    } else {
        fiveDay.innerHTML = '';
        getWeatherData(inputEl.value);
        inputEl.value = '';
        inputEl.setAttribute('placeholder', 'City name')
        inputEl.style.backgroundColor = '';
    }    
})