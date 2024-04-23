const socket = io();
const btn_send_message = document.getElementById("send-message");
const input = document.getElementById("send-input");
const messages = document.getElementById("messages");
const users_list = document.getElementById("users");

btn_send_message.addEventListener("click", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("msg", input.value);
    input.value = " ";
  }
});
socket.on("msg", function (msg, user) {
  var item = document.createElement("li");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  today = "[" + h + ":" + m + ":"+ s + "]" + mm + "/" + dd + "/" + yyyy;
  item.setAttribute("id", "message-text");
  item.innerHTML =
    "<p id='message-usertext'>" +
    user +
    "</p>" +
    `<p id='message-date'>
    ${today} 
    </p>\n`;
  item.innerHTML += "<p id='message-msgtext'>" + msg + "</p>";
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight);
});
socket.on("users-list", function (socket) {
  console.log(socket);
  let userList = Array.from(socket);
  console.log(userList);
  //users_list.innerHTML =
   // '<ul id="users-online">' +
    //userList.length;
});
