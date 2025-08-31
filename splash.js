document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    
    // เมื่อผู้ใช้คลิกปุ่ม "เข้าสู่เว็บไซต์"
    enterButton.addEventListener('click', function() {
        // เพิ่มคลาส 'fade-out' เพื่อให้ Splash Screen ค่อยๆ จางหายไป
        splashScreen.classList.add('fade-out'); 
        
        // หน่วงเวลา 1 วินาที เพื่อให้ animation fade-out เล่นจนจบ
        setTimeout(function() {
            // จากนั้นเปลี่ยนหน้าไปยัง home.html
            window.location.href = 'home.html';
        }, 1000); 
    });
});