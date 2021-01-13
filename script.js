function getCoordintes() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
        return;

    }

    function error(err) {
        weatherDisplay.innerHTML = `
            <div class="error">
                ${err.message}
            </div>
            `
        console.warn(`ERROR(${err.code}): ${err.message}`);
        if (err.code == 1) {
            console.log("Permita a localização");
            weatherDisplay.innerHTML = `
            <div class="error">
                Permita a localização
            </div>
            `
        }

    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(condinates) {
    let [latC, lngC] = condinates;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latC}&lon=${lngC}&zoom=108&addressdetails=1`)
        .then((response) => {
            return response.json();
        })
        .then((api) => {
            console.log(api);
            const { address, lat, lon } = api;
            const { city } = address;
            getWeather(null, lat, lon);

        })
        .catch(err => {
            console.error("Não foi possivel achar a cidade, tentando pela latitude longitude");
            console.error(err);
            getWeather(null, latC, lngC);
        })
        .catch(err => {
            console.error("Não foi possivel achar a localização");
            console.error(err);
            weatherDisplay.innerHTML = `
            <div class="error">
                ${err.message}
            </div>
            `

        });


}

function getWeather(city, lat, lng) {
    let cityC = city && `q=${encodeURIComponent(city)}`;
    let latlngC = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;

    console.log("----------------------");
    console.log(cityC);
    console.log(latlngC);
    console.log((cityC || latlngC));

    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?${(cityC || latlngC)}&lang=pt&units=metric`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "",
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
            }
        })
        .then((response) => {
            //if (!response.ok) throw new Error('Erro na requisição status ' + response.status)
            return response.json();
        })
        .then((api) => {
            console.log(api);
            if (api.cod == 200) {
                let { main, name } = api;
                let { temp, temp_max, temp_min } = main;

                weatherDisplay.innerHTML = `
                <div class="display">
                    <h1> ${name}</h1>
                    <div class="level1">
                        <h2>
                        ${temp} °C
                        </h2>
                    </div>
                    <div class="level2">
                        <h3>${temp_max} °C max</h3>
                        <h3>${temp_min} °C min</h3>
                    </div>
                </div>
            `;
            } else {
                weatherDisplay.innerHTML = `
                    <div class="error">
                        ${api.message}
                    </div>
                    `;
            }


        })
        .catch(err => {
            console.error(err);
            weatherDisplay.innerHTML = `
            <div class="error">
                ${err.message}
            </div>
            `
        });



}

function searchWeather() {
    let textBox = document.getElementById("locationText");
    let city = textBox.value;
    console.log(city);
    textBox.value = "";
    getWeather(city);

}

var weatherDisplay = "";

function loadedPage() {
    var input = document.getElementById("locationText");
    weatherDisplay = document.getElementById("weather");

    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchWeather();
        }
    });
}

//getCoordintes();