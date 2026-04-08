// --- 1. ตั้งค่าพื้นฐาน (ห้ามลบ) ---
const API_KEY = 'b0ff8a489a03169e7d3bf7d9cb6e9bfe'; 
let slideIndex = 1;
let autoSlideInterval;

const regions = [
    { label: 'ภาคเหนือ', city: 'Chiang Mai' },
    { label: 'ภาคกลาง', city: 'Phra Nakhon Si Ayutthaya' },
    { label: 'ภาคตะวันออก', city: 'Chon Buri' },
    { label: 'ภาคตะวันตก', city: 'Kanchanaburi' },
    { label: 'ภาคใต้', city: 'Phuket' },
    { label: 'กรุงเทพมหานคร', city: 'Bangkok' }
];

// --- 2. ฟังก์ชันหลักทำงานเมื่อโหลดหน้าเว็บ ---
document.addEventListener('DOMContentLoaded', function() {
    
    const audio = document.getElementById('myRadio');
    const playBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const statusText = document.getElementById('statusText');
    const volumeSlider = document.getElementById('volumeSlider');
    const bufferBar = document.getElementById('bufferBar');
    const currentTimeDisplay = document.getElementById('currentTime');

    // ตัวแปรสำคัญ: ใช้เช็คว่า "ได้เริ่มเล่นครั้งแรกไปหรือยัง"
    let isFirstPlayDone = false;

    // ฟังก์ชันเล่นครั้งแรก (เมื่อคลิกตรงไหนก็ได้ของเว็บ)
    function playOnFirstInteraction() {
        if (!isFirstPlayDone && audio.paused) {
            isFirstPlayDone = true; // ล็อคทันทีห้ามรันซ้ำ
            audio.src = "https://radio9.plathong.net/7194/stream?t=" + new Date().getTime();
            audio.play().then(() => {
                if (playIcon) playIcon.classList.replace('fa-play', 'fa-pause');
                if (statusText) { statusText.innerText = "ON AIR"; statusText.style.color = "red"; }
            }).catch(err => {
                isFirstPlayDone = false; // ถ้าเบราว์เซอร์ยังบล็อก ให้ปลดล็อคเพื่อรอคลิกถัดไป
            });
        }
    }

    // --- ดักจับการคลิก "ครั้งแรก" ทั่วทั้งหน้าเว็บ ---
    document.body.addEventListener('click', playOnFirstInteraction, { once: true });
    // สำหรับมือถือ (ถ้าอยากให้แตะแล้วเล่นเลย)
    document.body.addEventListener('touchstart', playOnFirstInteraction, { once: true });


    // --- 3. ระบบควบคุมปุ่ม Play/Pause (ปุ่มนี้ต้องใหญ่กว่าและหยุดได้จริง) ---
    if (playBtn && audio) {
        playBtn.onclick = function(e) {
            e.stopPropagation(); // สำคัญมาก: ป้องกันไม่ให้ Event วิ่งไปโดน body จนรวน
            isFirstPlayDone = true; // ถ้ากดปุ่มเล่นเอง ให้ถือว่าการ Interact ครั้งแรกเสร็จสิ้นแล้ว

            if (audio.paused) {
                audio.src = "https://radio9.plathong.net/7194/stream?t=" + new Date().getTime();
                audio.play().then(() => {
                    if (playIcon) playIcon.classList.replace('fa-play', 'fa-pause');
                    if (statusText) { statusText.innerText = "ON AIR"; statusText.style.color = "red"; }
                });
            } else {
                audio.pause();
                audio.src = ""; // ตัด Stream ทันที
                if (playIcon) playIcon.classList.replace('fa-pause', 'fa-play');
                if (statusText) { statusText.innerText = "LIVE ONLINE"; statusText.style.color = "#444"; }
            }
        };
    }

    // --- ส่วนงานอื่นๆ (เวลา, สไลด์, อากาศ) ---
    updateDateTime();
    setInterval(updateDateTime, 1000);
    showSlides(slideIndex);
    startAutoSlideshow();
    fetchThailandWeather();
    fetchBangkokAir();
    
    // ... ส่วนที่เหลือ (Volume, TimeUpdate) เหมือนเดิมได้เลยค่ะ ...

    // ระบบเมนูมือถือ
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.onclick = function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        };
    }
});

// --- 3. ฟังก์ชันพยากรณ์อากาศ 6 ภูมิภาค ---
async function fetchThailandWeather() {
    const displayArea = document.getElementById('weather-display');
    if (!displayArea) return;

    let htmlContent = '';
    for (let region of regions) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${region.city},TH&appid=${API_KEY}&units=metric&lang=th`);
            const data = await response.json();
            
            if (data.cod === 200) {
                let skyIcon = "fa-sun"; 
                const mainWeather = data.weather[0].main;
                
                if (region.label === 'ภาคเหนือ' && (mainWeather === "Smoke" || mainWeather === "Haze" || data.main.temp > 35)) {
                    skyIcon = "fa-smog";
                } else {
                    if (mainWeather === "Clouds") skyIcon = "fa-cloud";
                    else if (mainWeather === "Rain") skyIcon = "fa-cloud-showers-heavy";
                    else if (mainWeather === "Clear") skyIcon = "fa-sun";
                    else skyIcon = "fa-cloud-sun";
                }

                htmlContent += `
                    <div class="region-card">
                        <div class="region-name">${region.label}</div>
                        <div class="weather-info-row">
                            <i class="fa-solid ${skyIcon}" style="color: ${skyIcon === 'fa-smog' ? '#999' : '#ffb300'}; font-size: 20px;"></i>
                            <span class="temp">${Math.round(data.main.temp)}°C</span>
                        </div>
                        <div class="status" style="font-size:10px;">${data.weather[0].description}</div>
                    </div>`;
            }
        } catch (error) { console.log("Weather error"); }
    }
    displayArea.innerHTML = htmlContent;
}

// --- 4. ฟังก์ชันอากาศ กทม. + ระบบทักทาย ---
async function fetchBangkokAir() {
    const airArea = document.getElementById('air-display');
    if (!airArea) return;

    try {
        const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=13.75&lon=100.50&appid=${API_KEY}`);
        const airData = await airRes.json();

        if (airData.list && airData.list.length > 0) {
            const aqi = airData.list[0].main.aqi; 
            const pm25 = airData.list[0].components.pm2_5;
            
            const airMap = {
                1: { text: "สดใสมาก", color: "#2ecc71", icon: "fa-face-smile-beam" }, 
                2: { text: "สดใส", color: "#9cd84e", icon: "fa-face-smile" }, 
                3: { text: "ปานกลาง", color: "#f1c40f", icon: "fa-face-meh" }, 
                4: { text: "เริ่มมัว", color: "#e67e22", icon: "fa-face-frown-slight" }, 
                5: { text: "ไม่ค่อยดี", color: "#e74c3c", icon: "fa-face-mask" } 
            };
            const cur = airMap[aqi] || airMap[1];

            const hour = new Date().getHours();
            let greeting = (hour >= 5 && hour < 11) ? "อรุณสวัสดิ์ยามเช้า (กทม.)" :
                           (hour >= 11 && hour < 16) ? "สวัสดียามบ่าย (กทม.)" :
                           (hour >= 16 && hour < 20) ? "สวัสดียามเย็น (กทม.)" : "สวัสดียามค่ำคืน (กทม.)";

            airArea.innerHTML = `
                <div class="air-bar-clean">
                    <div class="air-icon-wrap" style="color: ${cur.color}; font-size: 30px;">
                        <i class="fa-solid ${cur.icon}"></i>
                    </div>
                    <div class="air-content">
                        <div class="air-header">${greeting}</div>
                        <div class="air-main-info">
                            <span class="air-status-text" style="color: ${cur.color};">${cur.text}</span>
                            <span class="air-sep">|</span>
                            <span class="air-pm-value">ฝุ่น PM2.5: <strong>${Math.round(pm25)}</strong> µg/m³</span>
                        </div>
                    </div>
                </div>`;
        }
    } catch (error) { console.log("Air error"); }
}

// --- 5. ฟังก์ชันจัดการสไลด์และเวลา ---
function plusSlides(n) { clearInterval(autoSlideInterval); showSlides(slideIndex += n); startAutoSlideshow(); }
function currentSlide(n) { clearInterval(autoSlideInterval); showSlides(slideIndex = n); startAutoSlideshow(); }
function startAutoSlideshow() { autoSlideInterval = setInterval(() => plusSlides(1), 10000); }

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (!slides || slides.length === 0) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; slides[i].style.opacity = "0"; }
    slides[slideIndex-1].style.display = "block";
    setTimeout(() => { slides[slideIndex-1].style.opacity = "1"; }, 20);
    if (dots.length) {
        for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
        dots[slideIndex-1].className += " active";
    }
}

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('th-TH', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
    }
}