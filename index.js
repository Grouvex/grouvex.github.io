function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

function showNotification() {
  document.getElementById("notification").style.display = "block";
}
window.onload = showNotification;

function openVideo(url) {
  document.getElementById('videoModal').style.display = 'block';
  document.getElementById('videoFrame').src = url;
}
function closeVideo() {
  document.getElementById('videoModal').style.display = 'none';
  document.getElementById('videoFrame').src = '';
}
