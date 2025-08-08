document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.querySelector('audio');
    
    // พยายามเล่นเพลงอัตโนมัติ
    audioPlayer.play().catch(error => {
        // หากเบราว์เซอร์บล็อกการเล่นอัตโนมัติ ให้แสดงข้อความแจ้งเตือน
        console.log('การเล่นอัตโนมัติถูกบล็อก', error);
    });
});