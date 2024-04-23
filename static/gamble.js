const socket = io();
const bid_button = document.getElementById("bid");

const CurrentPrice = document.getElementById("Price");
const Price = document.getElementById("CurrentPrice");
const LastPerson = document.getElementById("LastPerson");

bid_button.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("bidOn");
});
socket.on("connection", () => {
  Price.innerText = arg1;
})

socket.on("getCurrentItem", (arg1, arg2, arg3) => {
  console.log(arg1 + arg2 + arg3);
  
  LastPerson.innerText = arg3;
  CurrentPrice.innerText = arg2;
});
socket.on("bidOn", (arg1, arg2) => {
  CurrentPrice.innerText = arg1;
  LastPerson.innerText = arg2;
});
