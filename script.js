let slideIndex = 1;
let autoSlideInterval;

// ฟังก์ชันนี้จะทำงานเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. โค้ดสำหรับ Hamburger Menu (ย้ายมาไว้ข้างใน)
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');

    if (hamburgerBtn && navMenu) { // ตรวจสอบว่า element มีอยู่จริง
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

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

// ฟังก์ชันหลักที่ใช้แสดงผลสไลด์
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    // จัดการการวนลูป
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // ตั้งค่า opacity ของทุกสไลด์เป็น 0
    for (i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
    }
    
    // ลบคลาส 'active' ออกจาก dot ทั้งหมด
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // แสดงสไลด์ปัจจุบันและเพิ่มคลาส 'active' ให้ dot
    slides[slideIndex - 1].style.opacity = "1";
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