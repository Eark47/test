let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. จัดการวิทยุ ---
    const audio = document.getElementById('myRadio');
    const status = document.getElementById('status');

    function playAudio() {
        if (audio) {
            // ใช้ลิงก์สำรองที่พอร์ตมาตรฐาน เผื่อพอร์ต 7194 โดนบล็อก
            if (!audio.src.includes('radio9.plathong.net')) {
                audio.src = "https://radio9.plathong.net/7194/stream";
            }

            audio.play().then(() => {
                if (status) status.innerText = "สถานะ: กำลังเล่นออนไลน์";
                // เล่นได้แล้ว ลบ Event ออก
                document.removeEventListener('click', playAudio);
                document.removeEventListener('touchstart', playAudio);
            }).catch(error => {
                console.log('รอการคลิกจากผู้ใช้...');
            });
        }
    }

    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    // --- 2. จัดการ Hamburger Menu ---
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 3. จัดการ Slideshow (เริ่มทำงานตรงนี้) ---
    showSlides(slideIndex);
    startAutoSlideshow();

    // --- 4. วันที่และเวลา ---
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// ฟังก์ชันควบคุมสไลด์
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (!slides || slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    // ซ่อนทุกสไลด์ก่อน
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
        slides[i].style.opacity = "0";
    }
    
    // เอาสถานะ active ออกจากจุด (dots)
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // แสดงสไลด์ปัจจุบัน
    slides[slideIndex - 1].style.display = "block";
    setTimeout(() => {
        slides[slideIndex - 1].style.opacity = "1";
    }, 50);

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

function startAutoSlideshow() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
    };
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('th-TH', options);
    }
}