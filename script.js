let long;
let lat;
let temperatureDescription = document.querySelector(".temperature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let setIcon = document.querySelector(".icon");
let maxTemperature = document.querySelector(".maxTemp");
let minTemperature = document.querySelector(".minTemp");
let windSpeed = document.querySelector(".windSpeed");
let weather = document.querySelector("#weather");

weather.addEventListener("click", expandTab);

function expandTab() {
  if (!weather.classList.contains("expand")) {
    weather.classList.add("expand");
    setTimeout(() => {
      weather.classList.remove("expand");
    }, 3000);
  } else {
    weather.classList.remove("expand");
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    const data = await getWeatherdata(lat, long);

    // To Draw a India map using leaflet
    var map = L.map("map").setView([20.9716, 80.5946], 5);

    L.tileLayer(
      "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OdpemAaV0raJvYO6cUSS",
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      }
    ).addTo(map);

    // To show a marker on the india map with the name of the place
    var marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup(data.name).openPopup();

    // to add a click handler on map
    map.on("click", async function (e) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);

      // Calling the weather api with new lat long
      const data = await getWeatherdata(e.latlng.lat, e.latlng.lng);

      // Showing the marker at the clicked position with the city name(position name)
      marker.setLatLng([e.latlng.lat, e.latlng.lng]);
      marker.bindPopup(data.name).openPopup();
    });
  });
}

async function getWeatherdata(lat, long) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=943d090e06567f9f07df862240b696f1`;

  let response = await fetch(api);
  let data = await response.json();

  console.log("Weather data:", data); // Debugging log

  weatherDataHandler(data);
  return data;
}

function weatherDataHandler(data) {
  const { temp } = data.main;
  const { description, icon } = data.weather[0];
  const { temp_max, temp_min } = data.main;
  const { speed } = data.wind;

  temperatureDegree.textContent = `${temp}° C`;
  temperatureDescription.textContent = description;
  locationTimezone.textContent = data.name;
  maxTemperature.textContent = `Max: ${temp_max}° C`;
  minTemperature.textContent = `Min: ${temp_min}° C`;
  windSpeed.textContent = `Wind Speed: ${speed} m/s`;

  const iconClass = setIconFunction(icon);
  console.log("Icon class:", iconClass); // Debugging log
  setIcon.className = `icon wi ${iconClass}`;
}

function setIconFunction(icon) {
  const icons = {
    "01d": "wi-day-sunny",
    "02d": "wi-day-cloudy",
    "03d": "wi-cloudy",
    "04d": "wi-cloudy-windy",
    "09d": "wi-showers",
    "10d": "wi-rain",
    "11d": "wi-thunderstorm",
    "13d": "wi-snow",
    "50d": "wi-fog",
    "01n": "wi-night-clear",
    "02n": "wi-night-alt-cloudy",
    "03n": "wi-night-cloudy",
    "04n": "wi-night-cloudy-windy",
    "09n": "wi-night-showers",
    "10n": "wi-night-rain",
    "11n": "wi-night-thunderstorm",
    "13n": "wi-night-snow",
    "50n": "wi-night-fog",
  };

  return icons[icon];
}
