const socket = io();
const btn_send_message = document.getElementById('send-message');
const input = document.getElementById('send-input');
const messages = document.getElementById('messages');
const users_list = document.getElementById('users');
// TODO:
//save messages to local Storage

btn_send_message.addEventListener('click', function(e) {
  e.preventDefault();
  if(input.value) {
    socket.emit('msg', input.value);
    input.value = " ";
  } 
});
socket.on('msg', function(msg, user) {
  var item = document.createElement('li');
  item.textContent = user + ": " + msg;
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight);
});
socket.on('users-list', function(socket) {
  console.log(socket)
  let userList = Array.from(socket);
  console.log(userList);
  users_list.innerHTML = '<ul id="users-online">' + 
    userList.map(function (u) {
      return '<li>' + u.username + '</li>';
    }).join('')
    + '</ul>';
  });