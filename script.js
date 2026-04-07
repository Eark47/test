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
    
    // เริ่มระบบวันเวลา
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // เริ่มระบบสไลด์
    showSlides(slideIndex);
    startAutoSlideshow();

    // ดึงข้อมูลอากาศ (แถวบน) และ ฝุ่น (แถวล่าง)
    fetchThailandWeather();
    fetchBangkokAir();

    // ระบบเมนูมือถือ
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.header-right-side');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.onclick = function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        };
    }

    // --- 3. ระบบควบคุมวิทยุ ---
    const audio = document.getElementById('myRadio');
    const playBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const statusText = document.getElementById('statusText');
    const volumeSlider = document.getElementById('volumeSlider');
    const bufferBar = document.getElementById('bufferBar');
    const currentTimeDisplay = document.getElementById('currentTime');

    if (playBtn && audio) {
        playBtn.onclick = function(e) {
            e.stopPropagation();
            if (audio.paused) {
                audio.src = "https://radio9.plathong.net/7194/stream?t=" + new Date().getTime();
                audio.play().then(() => {
                    if (playIcon) playIcon.classList.replace('fa-play', 'fa-pause');
                    if (statusText) { statusText.innerText = "ON AIR"; statusText.style.color = "red"; }
                }).catch(err => console.log("คลิกเพื่อเล่น"));
            } else {
                audio.pause();
                audio.src = "";
                if (playIcon) playIcon.classList.replace('fa-pause', 'fa-play');
                if (statusText) { statusText.innerText = "LIVE ONLINE"; statusText.style.color = "#444"; }
            }
        };
    }

    if (audio) {
        audio.ontimeupdate = function() {
            const seconds = Math.floor(audio.currentTime);
            const minutes = Math.floor(seconds / 60);
            if (currentTimeDisplay) {
                currentTimeDisplay.innerText = minutes.toString().padStart(2, '0') + ":" + (seconds % 60).toString().padStart(2, '0');
            }
            if (bufferBar) bufferBar.style.width = ((audio.currentTime % 60) / 60 * 100) + "%";
        };
    }

    if (volumeSlider && audio) {
        volumeSlider.oninput = function(e) { audio.volume = e.target.value; };
    }
});

// --- 4. ฟังก์ชันพยากรณ์อากาศ 6 ภูมิภาค (แถวบน) ---
async function fetchThailandWeather() {
    const displayArea = document.getElementById('weather-display');
    if (!displayArea) return;
    let htmlContent = '';
    for (let region of regions) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${region.city},TH&appid=${API_KEY}&units=metric&lang=th`);
            const data = await response.json();
            if (data.cod === 200) {
                htmlContent += `
                    <div class="region-card">
                        <div class="region-name">${region.label}</div>
                        <div class="weather-info-row">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" width="30">
                            <span class="temp">${Math.round(data.main.temp)}°C</span>
                        </div>
                        <div class="status" style="font-size: 10px;">${data.weather[0].description}</div>
                    </div>`;
            }
        } catch (error) { console.log("Weather error"); }
    }
    displayArea.innerHTML = htmlContent;
}

// --- 4. ฟังก์ชันพยากรณ์อากาศ 6 ภูมิภาค (ปรับภาคเหนือให้เป็นรูปควัน) ---
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
                
                // เงื่อนไขพิเศษ: ถ้าเป็นภาคเหนือ ให้เช็คเรื่องฝุ่นควัน/หมอก
                if (region.label === 'ภาคเหนือ' && (mainWeather === "Smoke" || mainWeather === "Haze" || data.main.temp > 35)) {
                    skyIcon = "fa-smog"; // ไอคอนรูปกลุ่มควัน
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

// --- 5. ฟังก์ชันอากาศ กทม. (เอาเมฆข้างหน้าออก เหลือแค่หน้าคน) ---
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

            // ตัดส่วน sky-icon-wrap ออกเรียบร้อยครับ
            airArea.innerHTML = `
                <div class="air-bar-clean">
                    <div class="air-icon-wrap" style="color: ${cur.color}; font-size: 30px;">
                        <i class="fa-solid ${cur.icon}"></i>
                    </div>
                    <div class="air-content">
                        <div class="air-header">อากาศวันนี้ (กทม.)</div>
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
// --- 6. ฟังก์ชันจัดการสไลด์และเวลา (Global) ---
function plusSlides(n) { clearInterval(autoSlideInterval); showSlides(slideIndex += n); startAutoSlideshow(); }
function currentSlide(n) { clearInterval(autoSlideInterval); showSlides(slideIndex = n); startAutoSlideshow(); }
function startAutoSlideshow() { autoSlideInterval = setInterval(() => plusSlides(1), 10000); }

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (!slides || slides.length === 0) return;
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

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    if (dateElement) dateElement.textContent = now.toLocaleDateString('th-TH', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
    });
}