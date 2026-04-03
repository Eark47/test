let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    // 1. จัดการเครื่องเล่นวิทยุออนไลน์ (ปรับปรุงเพื่อแก้ปัญหา Connection Timed Out)
    const audio = document.getElementById('myRadio');
    const status = document.getElementById('status');

    function playAudio() {
        if (audio) {
            // บังคับให้เปลี่ยนไปใช้ URL สำรองที่เข้าถึงง่ายกว่า (พอร์ตมาตรฐาน 443)
            // หาก URL เดิมใน HTML มีปัญหา โค้ดนี้จะช่วยแก้ให้ครับ
            if (!audio.src.includes('radio9.plathong.net')) {
                audio.src = "https://radio9.plathong.net/7194/stream";
            }

            audio.play().then(() => {
                if (status) status.innerText = "สถานะ: กำลังเล่นออนไลน์";
                console.log('Radio is playing');
                // เล่นได้แล้วหยุดดักจับการคลิก
                document.removeEventListener('click', playAudio);
                document.removeEventListener('touchstart', playAudio);
            }).catch(error => {
                // ถ้ายังไม่ได้คลิกหน้าจอจะติด Error นี้ (ปกติของ Chrome)
                if (status) status.innerText = "สถานะ: พร้อมเล่น (คลิกที่นี่เพื่อฟัง)";
                console.log('Waiting for user interaction...');
            });
        }
    }

    // ดักจับการคลิกครั้งแรกในหน้าเว็บเพื่อเริ่มเพลง
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    // พยายามเล่นทันที
    playAudio();

    // 2. จัดการ Hamburger Menu
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 3. จัดการ Slideshow
    showSlides(slideIndex);
    startAutoSlideshow();

    // 4. จัดการวันที่และเวลา
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// --- ฟังก์ชัน Slideshow และ DateTime (คงเดิมแต่ปรับปรุงความเสถียร) ---

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (!slides || slides.length === 0) return;
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
        slides[i].style.opacity = "0";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

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
    autoSlideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000);
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',