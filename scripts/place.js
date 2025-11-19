/*
    place.js
    Define static values to match the displayed weather section values.
    Update the numbers below if your page shows different temperature or wind speed.
*/

const temperature = 46; // static displayed temperature (°F)
const windSpeed = 10;   // static displayed wind speed (mph)

function calculateWindChill(temp, speed) {
    return 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
}

// Determine display value without calling calculateWindChill unless conditions are met:
// Imperial limits: temperature <= 50 °F and windSpeed > 3 mph
let windChillDisplay;
if (temperature <= 50 && windSpeed > 3) {
    windChillDisplay = Math.round(calculateWindChill(temperature, windSpeed)) + "°F";
} else {
    windChillDisplay = "N/A";
}

// Update the windchill element in the weather section
document.getElementById('windchill').textContent = windChillDisplay;

// Export or expose windChillDisplay if needed (uncomment for module usage)
// module.exports = { calculateWindChill, windChillDisplay };

document.getElementById('currentyear').textContent = new Date().getFullYear();

document.getElementById("lastmodified").innerHTML = document.lastModified;