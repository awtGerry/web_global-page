// NOTIFICACIONES
var notificationbar = document.getElementById('notification');

document.getElementById('send_msg').addEventListener("click", notificationPop);

function notificationHide() {
  notificationbar.classList.remove('notification__pop');
}

function notificationDisplay() {
  notificationbar.classList.add('notification__pop');
}

function notificationPop() {
  notificationDisplay();
  setTimeout(notificationHide, 2500);
}
