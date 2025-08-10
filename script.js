// Function to update the current date in Thai format
function updateThaiDate() {
    // Find the element with the ID 'current-date'
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        // Get the current date
        const now = new Date();
        // Define options for formatting the date
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        // Format the date using Thai locale
        const thaiDate = now.toLocaleDateString('th-TH', options);
        // Update the content of the element
        dateElement.textContent = thaiDate;
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', updateThaiDate);
