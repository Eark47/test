document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('mute-btn');

    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.addEventListener('play', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    audioPlayer.addEventListener('pause', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', function() {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = progressPercent + '%';
        }
    });

    // Set volume
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value;
        if (this.value > 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            audioPlayer.muted = false;
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            audioPlayer.muted = true;
        }
    });

    // Mute/Unmute functionality
    muteBtn.addEventListener('click', function() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeSlider.value = audioPlayer.volume; // Set slider to previous volume
        } else {
            audioPlayer.muted = true;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0; // Set slider to 0
        }
    });
});