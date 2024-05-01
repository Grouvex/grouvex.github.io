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
