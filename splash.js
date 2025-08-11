document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splash-screen');
  const enterButton = document.getElementById('enter-button');
  const delay = 10000;
  
  function goToHomepage() {
    splashScreen.classList.add('fade-out'); // เพิ่มคลาส fade-out
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000); // หน่วงเวลาให้เท่ากับ transition ใน CSS
  }

  const timeoutId = setTimeout(goToHomepage, delay);
  
  enterButton.addEventListener('click', function() {
    clearTimeout(timeoutId);
    goToHomepage();
  });
});