//defining values
let cityinput = document.getElementById('cityid');
let search = document.getElementById('locationbtn');
let locate = document.getElementById('currentid');
let api_key = '4eb6f17b6459ee6e4ac8f03ea64e910c';
currentweathercard = document.querySelectorAll('.weatherleft .card')[0];
fivedaysforecastcard = document.querySelector('.dayforcast');

//otherfunctions
function getweatherdetails(name , lat , lon , country , state){
    let forecastsapi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    weatherapi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thrusday',
        'Friday',
        'Saturday'
    ],
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    fetch(weatherapi).then(res => res.json()).then(data => {
        let date = new Date();
        currentweathercard.innerHTML =`
        <div class="currentweather">
                            <div class="details">
                                <p>Now</p>
                                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                                <p>${data.weather[0].description}</p>
                                <div class="wicon">
                                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
                                </div>
                            </div>
                            <hr>
                            <div class="cfooter">
                                <p>&#xf133 ${days[date.getDay()]},${date.getDate()},${months[date.getMonth()]},${date.getFullYear()}</p>
                                <p>&#xf076 ${name},${country}</p>
                            </div>
                        </div>
        `
    }).catch(() => {
        alert('Failed to fetch Data');
    });
    fetch(forecastsapi).then(res => res.json()).then(data =>{
        let uniqueforecastdays = [];
        let FiveDaysForecast = data.list.filter(forecast =>{
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueforecastdays.includes(forecastDate)){
                return uniqueforecastdays.push(forecastDate);
            }
        });
        fivedaysforecastcard.innerHTML = '';
        for(i=1;i<FiveDaysForecast.length; i++){
            let date = new Date(FiveDaysForecast[i].dt_txt);
            fivedaysforecastcard.innerHTML += `
            <div class="forcastitem">
                                <div class="wicon2">
                                    <img src="https://openweathermap.org/img/wn/${FiveDaysForecast[i].weather[0].icon}.png" alt="">
                                    <span>${(FiveDaysForecast[i].main.temp -273.15).toFixed(2)}&deg;C</span>
                                </div>
                                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                                <p>${days[date.getDay()]}</p>
                            </div>
            `
        }
    }).catch(() => {
        alert('Failed to Fetch Weather forecast')
    });
}

function getcitycoordinates(){
    let cityname = cityinput.value.trim();
    cityinput.value = '';
    if(!cityname) return;
    let geocodingapi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${api_key}`;
    fetch(geocodingapi).then(res => res.json()).then(data => {
        if (data.length > 0) { // Check if data is returned
            const { name, lat, lon, country, state } = data[0];
            getweatherdetails(name, lat, lon, country, state);
        } else {
            alert(`City ${cityname} not found.`);
        }
    }).catch(() => {
        alert(`Failed To Fetch Coordinates of ${cityname}`)});
}
search.addEventListener('click',getcitycoordinates);
locate.addEventListener('click',getusercoordinates);
function getusercoordinates(){
    navigator.geolocation.getCurrentPosition(position =>{
        let {latitude , longitude} = position.coords;
        let reversegeocodes = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        fetch(reversegeocodes).then(res => res.json()).then(data => {
            let {name , country , state} = data[0];
            getweatherdetails(name , latitude , longitude , country , state);
        }).catch(() => {
            alert('Failed to fetch user coordinates')
        }, error => {
            if(error.code === error.PERMISSION_Denied){
                alert('Geolocation permission denied.Please reset location permission to grant access again')
            }
        });
    })
}