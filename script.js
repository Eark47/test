let slideIndex = 1;
let autoSlideInterval;

// ฟังก์ชันนี้จะทำงานเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', function() {
    
    // 2. จัดการ Slideshow
    showSlides(slideIndex);
    startAutoSlideshow();

    // 3. จัดการวันที่และเวลา
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Function to change slides by a given number (n)
function plusSlides(n) {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    showSlides(slideIndex += n);
    startAutoSlideshow();
}

// Function to go directly to a specific slide (n)
function currentSlide(n) {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    showSlides(slideIndex = n);
    startAutoSlideshow();
}

// Main function to display the correct slide
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    // จัดการการวนลูปของสไลด์
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    // ลบคลาส active ออกจากสไลด์และจุดทั้งหมด
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // เพิ่มคลาส active ให้กับสไลด์และจุดที่กำลังแสดงผล
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].className += " active";
}


// Function to start the automatic slideshow
function startAutoSlideshow() {
    autoSlideInterval = setInterval(function() {
        plusSlides(1); // Advance to the next slide every 10 seconds
    }, 5000);
}

// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = now.toLocaleDateString('th-TH', options);
    const dateElement = document.getElementById('current-date');
    
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}