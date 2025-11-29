// Review counter using localStorage
function updateReviewCounter() {
    // Get current count from localStorage
    let reviewCount = localStorage.getItem('reviewCount');
    
    // If no count exists, initialize to 0
    if (reviewCount === null) {
        reviewCount = 0;
    }
    
    // Increment the counter
    reviewCount = parseInt(reviewCount) + 1;
    
    // Save the new count to localStorage
    localStorage.setItem('reviewCount', reviewCount);
    
    // Display the count on the page
    const countElement = document.getElementById('reviewCount');
    if (countElement) {
        countElement.textContent = reviewCount;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', updateReviewCounter);
