// temples.js

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-menu');
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