let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('myRadio');
    const status = document.getElementById('status');

    // ฟังก์ชันสั่งเล่น
    function playAudio() {
        if (audio) {
            audio.play().then(() => {
                if (status) status.innerText = "สถานะ: กำลังเล่นออนไลน์";
                console.log('Radio is playing');
                // เล่นได้แล้วให้หยุดดักฟังการคลิก
                document.removeEventListener('click', playAudio);
                document.removeEventListener('touchstart', playAudio);
            }).catch(error => {
                console.log('Waiting for user interaction...');
            });
        }
    }

    // ดักจับการคลิกครั้งแรกในหน้าเว็บเพื่อเริ่มเพลง
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    // พยายามเล่นทันที (เผื่อกรณี Browser ยอม)
    playAudio();

    // 2. จัดการ Hamburger Menu
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // กันไม่ให้ไปทับกับ event อื่น
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

// ฟังก์ชันสำหรับเปลี่ยนสไลด์
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
    // ใช้ setTimeout เล็กน้อยเพื่อให้ Transition ทำงาน
    setTimeout(() => {
        slides[slideIndex - 1].style.opacity = "1";
    }, 50);
    
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

function startAutoSlideshow() {
    // ล้างของเก่าก่อนสร้างใหม่ กันมันซ้อนกัน
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000);
}

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