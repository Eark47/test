let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    // 1. จัดการเครื่องเล่นวิทยุออนไลน์ (ซ่อมส่วนที่ทำให้เล่นไม่ได้)
    const audio = document.getElementById('myRadio');
    const status = document.getElementById('status');

    function playAudio() {
        if (audio) {
            // เติม ?t= เพื่อล้าง Cache ลด Delay ให้สัญญาณสดที่สุด
            if (!audio.src.includes('?t=')) {
                audio.src = "https://radio9.plathong.net/7194/stream?t=" + new Date().getTime();
            }
            
            audio.play().then(() => {
                if (status) status.innerText = "สถานะ: กำลังเล่นออนไลน์";
                // เล่นได้แล้ว ลบ Event ออก
                document.removeEventListener('click', playAudio);
                document.removeEventListener('touchstart', playAudio);
            }).catch(error => {
                console.log('Waiting for user interaction...');
            });
        }
    }

    // ดักจับการคลิกส่วนไหนก็ได้เพื่อให้เพลงดัง (แก้ปัญหา Autoplay)
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    // 2. จัดการ Hamburger Menu (โค้ดเดิมของคุณ)
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 3. จัดการ Slideshow (โค้ดเดิมของคุณ)
    showSlides(slideIndex);
    startAutoSlideshow();

    // ส่วนปุ่มกด Keyboard (โค้ดเดิมของคุณ)
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

    // 4. จัดการวันที่และเวลา (โค้ดเดิมของคุณ)
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// ฟังก์ชันสำหรับเปลี่ยนสไลด์ (โค้ดเดิมของคุณ)
function plusSlides(n) {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    showSlides(slideIndex += n);
    startAutoSlideshow();
}

/// ฟังก์ชันหลักที่ใช้แสดงผลสไลด์ (ซ่อมส่วนที่หายไป)
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (!slides || slides.length === 0) return; // กัน Error

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    // 1. ซ่อนทุกรูปก่อน (เคลียร์หน้าจอ)
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  // บังคับให้ซ่อนเพื่อไม่ให้ Layout เละ
        slides[i].style.opacity = "0";
    }

    // 2. เอาสถานะ active ออกจากจุด (Dots)
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // 3. แสดงรูปปัจจุบัน (หัวใจสำคัญที่หายไป)
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block"; // สั่งให้ปรากฏ
        // รอเสี้ยววินาทีเพื่อให้ Transition ของ CSS ทำงาน (ถ้ามี)
        setTimeout(() => {
            slides[slideIndex - 1].style.opacity = "1";
        }, 20);
    }

    // 4. ใส่สถานะ active ให้จุดปัจจุบัน
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

// ฟังก์ชันเพื่อเริ่มการแสดงสไลด์อัตโนมัติ (โค้ดเดิมของคุณ)
function startAutoSlideshow() {
    if (autoSlideInterval) clearInterval(autoSlideInterval); // ล้างของเก่า
    autoSlideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000);
}

// ฟังก์ชันเพื่ออัปเดตวันที่และเวลาปัจจุบัน (โค้ดเดิมของคุณ)
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
    };
    const formattedDate = now.toLocaleDateString('th-TH', options);
    const dateElement = document.getElementById('current-date');

    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}