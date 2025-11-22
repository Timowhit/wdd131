// temples.js

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');

    // Show hamburger only on mobile via CSS (not JS)
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        // Toggle hamburger icon between ☰ and ✖
        if (nav.classList.contains('open')) {
            hamburger.textContent = '✖';
        } else {
            hamburger.textContent = '☰';
        }
    });
});

const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Tokyo Japan",
    location: "Tokyo, Japan",
    dedicated: "1980, October, 27",
    area: 53500,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
  },
  {
    templeName: "Bern Switzerland",
    location: "Bern, Switzerland",
    dedicated: "1955, September, 11",
    area: 12000,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/bern-switzerland-temple/bern-switzerland-temple-54641-main.jpg"
  },
  {
    templeName: "Nuku'alofa Tonga",
    location: "Nuku'alofa, Tonga",
    dedicated: "1983, June, 18",
    area: 10800,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/nuku'alofa-tonga-temple/nuku'alofa-tonga-temple-12094-main.jpg"
  },
];

function createTempleCard(temple) {
    const figure = document.createElement('figure');
    const div = document.createElement('div');
    div.className = 'image-container';
    
    const img = document.createElement('img');
    img.src = temple.imageUrl;
    img.alt = `${temple.templeName} Temple`;
    img.loading = 'lazy';
    img.width = 400;
    img.height = 250;
    
    const h3 = document.createElement('h3');
    h3.textContent = temple.templeName;
    
    const locationP = document.createElement('p');
    locationP.innerHTML = `<strong>Location:</strong> ${temple.location}`;
    
    const dedicatedP = document.createElement('p');
    dedicatedP.innerHTML = `<strong>Dedicated:</strong> ${temple.dedicated}`;
    
    const areaP = document.createElement('p');
    areaP.innerHTML = `<strong>Area:</strong> ${temple.area.toLocaleString()} sq ft`;
    
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(locationP);
    div.appendChild(dedicatedP);
    div.appendChild(areaP);
    figure.appendChild(div);
    
    return figure;
}

function displayTemples(templesToDisplay) {
    const container = document.getElementById('temple-cards');
    container.innerHTML = '';
    templesToDisplay.forEach(temple => {
        container.appendChild(createTempleCard(temple));
    });
}

// Helper function to get year from dedicated date string
function getYear(dedicatedString) {
    return parseInt(dedicatedString.split(',')[0]);
}

// Filter functions
function filterOld() {
    return temples.filter(temple => getYear(temple.dedicated) < 1900);
}

function filterNew() {
    return temples.filter(temple => getYear(temple.dedicated) > 2000);
}

function filterLarge() {
    return temples.filter(temple => temple.area > 90000);
}

function filterSmall() {
    return temples.filter(temple => temple.area < 10000);
}

// Display all temples on page load
document.addEventListener('DOMContentLoaded', () => {
    displayTemples(temples);
    
    // Add event listeners to navigation links
    document.getElementById('home').addEventListener('click', (e) => {
        e.preventDefault();
        displayTemples(temples);
    });
    
    document.getElementById('old').addEventListener('click', (e) => {
        e.preventDefault();
        displayTemples(filterOld());
    });
    
    document.getElementById('new').addEventListener('click', (e) => {
        e.preventDefault();
        displayTemples(filterNew());
    });
    
    document.getElementById('large').addEventListener('click', (e) => {
        e.preventDefault();
        displayTemples(filterLarge());
    });
    
    document.getElementById('small').addEventListener('click', (e) => {
        e.preventDefault();
        displayTemples(filterSmall());
    });
});