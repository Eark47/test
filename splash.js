document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 1;
    let autoSlideInterval;

    // ฟังก์ชันสำหรับแสดง Slides
    function showSlides(n) {
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        
        // ถ้า index เกินจำนวนสไลด์ ให้วนกลับไปสไลด์แรก
        if (n > slides.length) {
            slideIndex = 1;
        }
        
        // ถ้า index น้อยกว่า 1 (ถูกกด Prev ที่สไลด์แรก) ให้วนไปสไลด์สุดท้าย
        if (n < 1) {
            slideIndex = slides.length;
        }
        
        // ซ่อนสไลด์ทั้งหมด
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        // ลบ class 'active' ออกจากปุ่ม dot ทั้งหมด
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        
        // แสดงสไลด์ปัจจุบันและเพิ่ม class 'active' ให้ปุ่ม dot
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }

    // ฟังก์ชันสำหรับเปลี่ยน Slides ด้วยปุ่ม Next/Prev
    window.plusSlides = function(n) {
        clearInterval(autoSlideInterval); // หยุดการเปลี่ยนสไลด์อัตโนมัติ
        showSlides(slideIndex += n);
        startAutoSlideshow(); // เริ่มการเปลี่ยนสไลด์อัตโนมัติอีกครั้ง
    }

    // ฟังก์ชันสำหรับเปลี่ยน Slides ด้วย Dots
    window.currentSlide = function(n) {
        clearInterval(autoSlideInterval); // หยุดการเปลี่ยนสไลด์อัตโนมัติ
        showSlides(slideIndex = n);
        startAutoSlideshow(); // เริ่มการเปลี่ยนสไลด์อัตโนมัติอีกครั้ง
    }

    // ฟังก์ชันสำหรับเปลี่ยน Slides อัตโนมัติและวนลูป
    function startAutoSlideshow() {
        autoSlideInterval = setInterval(function() {
            showSlides(slideIndex += 1);
        }, 1000); // เปลี่ยนรูปทุก 5 วินาที
    }

    // ฟังก์ชันสำหรับสร้างปุ่ม Dot indicators อัตโนมัติ
    function createDots() {
        const dotsContainer = document.querySelector('.slideshow-dots');
        if (dotsContainer) {
            const numSlides = document.querySelectorAll('.mySlides').length;
            for (let i = 0; i < numSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.setAttribute('onclick', `currentSlide(${i + 1})`);
                dotsContainer.appendChild(dot);
            }
        }
    }

    // เริ่มการทำงานทั้งหมดเมื่อโหลดหน้าเว็บ
    createDots();
    showSlides(slideIndex);
    startAutoSlideshow();
    
    // โค้ดสำหรับแสดงวันที่ปัจจุบัน
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('th-TH', options);
    }
});