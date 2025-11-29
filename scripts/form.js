// Product array - electronics products
const products = [
    {
        id: "laptop-pro",
        name: "UltraBook Pro 15"
    },
    {
        id: "smartphone-x",
        name: "SmartPhone X Ultra"
    },
    {
        id: "wireless-earbuds",
        name: "Wireless Earbuds Pro"
    },
    {
        id: "smartwatch-elite",
        name: "SmartWatch Elite Series"
    },
    {
        id: "tablet-max",
        name: "Tablet Max 12.9"
    },
    {
        id: "gaming-console",
        name: "Gaming Console Next Gen"
    },
    {
        id: "4k-monitor",
        name: "4K Ultra HD Monitor 27"
    },
    {
        id: "bluetooth-speaker",
        name: "Bluetooth Speaker Premium"
    },
    {
        id: "wireless-mouse",
        name: "Wireless Ergonomic Mouse"
    },
    {
        id: "mechanical-keyboard",
        name: "Mechanical RGB Keyboard"
    }
];

// Populate the product select dropdown
function populateProducts() {
    const selectElement = document.getElementById('productName');
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        selectElement.appendChild(option);
    });
}

// Set today's date as default for installation date
function setDefaultDate() {
    const dateInput = document.getElementById('installDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // Make the entire date input clickable to open the picker
    dateInput.addEventListener('click', function() {
        this.showPicker();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateProducts();
    setDefaultDate();
});
