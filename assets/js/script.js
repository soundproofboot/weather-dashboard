// html elements from form
let inputEl = document.querySelector('#city-input')
let submitBtn = document.querySelector('#submit-button');
let formEl = document.querySelector('form');

// html elements for current weather data
let weatherDataEl = document.querySelector('.weather-data')
let cityNameEl = document.querySelector('#city-name');
let currentStatsEl = document.querySelector('.current-stats');
let currentTempEl = document.querySelector('#temp')
let currentWindEl = document.querySelector('#wind')
let currentHumidityEl = document.querySelector('#humidity')
let currentUVEl = document.querySelector('#uv');

// html elements to build out five day forecast
let fiveDay = document.querySelector('.five-day');
let searchHistoryEl = document.querySelector('.search-history');
let fiveDayHeaderEl = document.querySelector('#five-day-header');

// current date formatted with moment for display
let currentDate = moment().format('l');

// urls for later use in functions
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial&q=';
let fiveDayURL = ''

// if there is no search history saved, create an empty array to store cities searched
if (!localStorage.cities) {
    localStorage.setItem('cities', JSON.stringify([]));
};

// make an array from local storage of cities previously searched, if any
let citiesArray = JSON.parse(localStorage.getItem('cities'));

// main function to pull all weather data from a city
var getWeatherData = function(city) {
    // fetch from base url plus city from user input
    fetch(baseURL + city)
    .then(function(response) {
        // convert response to json
        response.json()
        .then(function(data) {
            console.log(data);
            // if response does not return valid data
            if (data.message === 'city not found' || data.message === 'Nothing to geocode') {
                // display error message and hide previous search data, if any
                cityNameEl.innerHTML = `The city entered was not in the OpenWeather API list. For more info on OpenWeather API please visit <a href='https://openweathermap.org/api' target='_blank'>https://openweathermap.org/api</a>`
                currentStatsEl.style.display = 'none';
                fiveDayHeaderEl.style.display = 'none';
            } else {
                // show weather data elements, if hidden
                currentStatsEl.style.display = 'block';
                fiveDayHeaderEl.style.display = 'block';
                // set heading to current city/date
                cityNameEl.textContent = data.name + ` (${currentDate})`;
                // if city is NOT already in history
                if (!citiesArray.includes(data.name)) {
                    //  add to array from storage
                    citiesArray.push(data.name);
                    // save the new array back to storage
                    localStorage.setItem('cities', JSON.stringify(citiesArray));
                    // make a new search button with that city name
                    cityButtonMaker(data.name);
            }
            // grab correct icon from data, create an element to display it, link to correct img based on code
            let iconURL = data.weather[0].icon
            let iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + iconURL + '@2x.png')
            // add that icon to heading
            cityNameEl.appendChild(iconEl);

            // set current weather data to data received
            currentTempEl.textContent = 'Temp: ' + data.main.temp + '\xB0F';
            currentWindEl.textContent = 'Wind: ' + data.wind.speed + ' MPH';
            currentHumidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';

            // pull latitude and longitude for second api call
            let lat = data.coord.lat;
            let lon = data.coord.lon;

            // one call api to get uv data and five day forecast
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=8bfd6df7338458aeaebd48fdcb483a00&units=imperial&exclude=minutely,hourly,alerts`)
            .then(function(response) {
                response.json()
                .then(function(data) {
                    console.log(data);
                    // set uv index
                    let uvIndex = data.current.uvi;
                    currentUVEl.textContent = 'UV Index: ' + uvIndex;
                    // change background color based on uv index value
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

                    // five day forecast
                    fiveDayHeaderEl.textContent = '5 Day Forecast:';
                    fiveDay.innerHTML = '';
                    // loop through array of days in data, starting at index 1 (next day)
                    for (let i = 1; i <= 5; i++) {
                        // create a new list, give it class for styling
                        let cardEl = document.createElement('ul');
                        cardEl.classList.add('day');
                        
                        // create new list element, calculate date to show from current date
                        let dateEl = document.createElement('li');
                        dateEl.textContent = moment().add(i, 'day').format('l');
                        cardEl.appendChild(dateEl);

                        // pull icon from weather code, create image el and pull img from appropriate url
                        let iconEl = document.createElement('img');
                        let iconCode = data.daily[i].weather[0].icon;
                        iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`)
                        cardEl.appendChild(iconEl);

                        // create list element for temp, fill with temp data
                        let tempEl = document.createElement('li');
                        tempEl.textContent = 'Temp: ' + data.daily[i].temp.day + '\xB0F';
                        cardEl.appendChild(tempEl);

                        // create list element for wind, fill with wind speed
                        let windEl = document.createElement('li');
                        windEl.textContent = 'Wind: ' + data.daily[i].wind_speed + 'MPH';
                        cardEl.appendChild(windEl);

                        // create list element for humidity, fill with humidity data
                        let humidityEl = document.createElement('li');
                        humidityEl.textContent = 'Humidity: ' + data.daily[i].humidity + ' %';
                        cardEl.appendChild(humidityEl);

                        // add that card to five day forecast element
                        fiveDay.appendChild(cardEl);
                    }
                })
            })
        }
      }
     )
    })
};

// function to make new buttons for quick search of previously searched cities
var cityButtonMaker = function(city) {

    // create new button, text set to city provided as argument
    let newButton = document.createElement('button');
    newButton.textContent = city;
    searchHistoryEl.appendChild(newButton);

    // event listener for each button created
    newButton.addEventListener('click', function() {
        // reset input field, if filled
        inputEl.value = '';
        inputEl.setAttribute('placeholder', 'City name')
        inputEl.style.backgroundColor = '';
        // when clicked, get the weather data for the name on the button
        getWeatherData(city);
    });
}

// function to load buttons for each city stored in history
var displayHistory = function(arr) {
    for (let i = 0; i < arr.length; i++) {
        // make button for each city in the array
        cityButtonMaker(arr[i]);
    }
}

// call that function to populate search history area
displayHistory(citiesArray);

// click event listen for submit button to search weather data for a city
submitBtn.addEventListener('click', function() {
    // prevent default behavior (window refresh);
    event.preventDefault();

    // if user has not entered a city, change background color and text to alert user they need to enter text
    if (inputEl.value === '') {
        inputEl.setAttribute('placeholder', 'Please enter a city');
        inputEl.style.backgroundColor = 'pink';
    } else {
        // clears any previous data
        fiveDay.innerHTML = '';
        // gets weather data from user input
        getWeatherData(inputEl.value);
        // reset city input for another search
        inputEl.value = '';
        inputEl.setAttribute('placeholder', 'City name')
        inputEl.style.backgroundColor = '';
    }    
})