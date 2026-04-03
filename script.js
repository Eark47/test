let slideIndex = 1;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('myRadio');
    const playBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const statusText = document.getElementById('statusText');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // --- เพิ่มตัวแปรสำหรับแถบบัฟเฟอร์และเวลา ---
    const bufferBar = document.getElementById('bufferBar');
    const currentTimeDisplay = document.getElementById('currentTime');

    // ฟังก์ชันเล่น/หยุด
    function toggleRadio() {
        if (audio.paused) {
            audio.src = "https://radio9.plathong.net/7194/stream?t=" + new Date().getTime();
            audio.play().then(() => {
                updateUI(true);
                document.removeEventListener('click', toggleRadio);
            }).catch(err => console.log("User interaction required"));
        } else {
            audio.pause();
            updateUI(false);
            audio.src = "";
            // รีเซ็ตแถบบัฟเฟอร์เมื่อหยุด
            if (bufferBar) bufferBar.style.width = "0%";
            if (currentTimeDisplay) currentTimeDisplay.innerText = "00:00";
        }
    }

    function updateUI(isPlaying) {
        if (isPlaying) {
            playIcon.classList.replace('fa-play', 'fa-pause');
            statusText.innerText = "ON AIR";
            statusText.style.color = "red";
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
            statusText.innerText = "LIVE ONLINE";
            statusText.style.color = "#444";
        }
    }

    // --- ระบบอัปเดตแถบบัฟเฟอร์และเวลาเล่นจริง ---
    if (audio) {
        audio.addEventListener('timeupdate', function() {
            const seconds = Math.floor(audio.currentTime);
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = (seconds % 60).toString().padStart(2, '0');
            const displayMinutes = (minutes % 60).toString().padStart(2, '0');
            
            if (currentTimeDisplay) {
                currentTimeDisplay.innerText = `${displayMinutes}:${displaySeconds}`;
            }

            // จำลองแถบวิ่งวนทุกๆ 60 วินาทีเพื่อให้ดูมีการเคลื่อนไหว (สำหรับ Live Stream)
            let progress = (audio.currentTime % 60) / 60 * 100; 
            if (bufferBar) {
                bufferBar.style.width = progress + "%";
            }
        });
    }

    // คลิกหน้าจอครั้งแรกเพื่อให้เสียงดัง (Autoplay)
    document.addEventListener('click', toggleRadio);

    // ปุ่ม Play/Pause
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleRadio();
        });
    }

    // ปรับระดับเสียง
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });
    }

    // --- ส่วนสไลด์และเมนู ---
    showSlides(slideIndex);
    startAutoSlideshow();

    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// ฟังก์ชันสไลด์ (ปรับเวลาเป็น 10 วินาทีตามต้องการ)
function plusSlides(n) {
    clearInterval(autoSlideInterval);
    showSlides(slideIndex += n);
    startAutoSlideshow();
}

function currentSlide(n) {
    clearInterval(autoSlideInterval);
    showSlides(slideIndex = n);
    startAutoSlideshow();
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (!slides.length) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].style.opacity = "0";
    }
    slides[slideIndex-1].style.display = "block";
    setTimeout(() => { slides[slideIndex-1].style.opacity = "1"; }, 20);
    if (dots.length) {
        for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
        dots[slideIndex-1].className += " active";
    }
}

function startAutoSlideshow() {
    // ปรับเป็น 10000ms (10 วินาที)
    autoSlideInterval = setInterval(() => plusSlides(1), 10000);
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateElement = document.getElementById('current-date');
    if (dateElement) dateElement.textContent = now.toLocaleDateString('th-TH', options);
}