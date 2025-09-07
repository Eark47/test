let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    // 1. จัดการเครื่องเล่นวิทยุออนไลน์
    const audio = document.querySelector('audio');
    const userInteractedKey = 'userInteracted';

    if (localStorage.getItem(userInteractedKey) === 'true') {
        audio.play().then(() => {
            console.log('Playing automatically after refresh.');
        }).catch(error => {
            console.error('Autoplay failed after refresh:', error);
        });
    }

    document.addEventListener('click', function recordInteraction() {
        localStorage.setItem(userInteractedKey, 'true');
        audio.play().catch(error => {
            console.error('Failed to play on first interaction:', error);
        });
        document.removeEventListener('click', recordInteraction);
    });

    // 2. จัดการ Hamburger Menu
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 3. จัดการ Slideshow
    showSlides(slideIndex);
    startAutoSlideshow();

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            plusSlides(-1);
        } else if (event.key === 'ArrowRight') {
            plusSlides(1);
        }
    });

    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', function() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        });

        slideshowContainer.addEventListener('mouseleave', function() {
            startAutoSlideshow();
        });
    }

    // 4. จัดการวันที่และเวลา
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// ฟังก์ชันสำหรับเปลี่ยนสไลด์ตามจำนวนที่กำหนด (n)
function plusSlides(n) {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    showSlides(slideIndex += n);
    startAutoSlideshow();
}

// ฟังก์ชันหลักที่ใช้แสดงผลสไลด์
function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
    }

    if (dots.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        dots[slideIndex - 1].className += " active";
    }

    slides[slideIndex - 1].style.opacity = "1";
}

// ฟังก์ชันเพื่อเริ่มการแสดงสไลด์อัตโนมัติ
function startAutoSlideshow() {
    autoSlideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000);
}

// ฟังก์ชันเพื่ออัปเดตวันที่และเวลาปัจจุบัน
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = now.toLocaleDateString('th-TH', options);
    const dateElement = document.getElementById('current-date');

    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}