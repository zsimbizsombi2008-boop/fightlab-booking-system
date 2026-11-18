const body = document.body;

const sport = body.dataset.sport;

console.log(sport);

const LevelSelector = document.querySelector("#level");
const Button = document.querySelector("#Booking-next-button")

LevelSelector.addEventListener("change", ()=>{
if(LevelSelector.value !== ""){
Button.disabled = false
Button.classList.add("able");
}else{
Button.disabled = true
Button.classList.remove("able");
}

console.log(LevelSelector.value)
})


Button.addEventListener("click", (event)=>{
event.preventDefault();
const level = LevelSelector.value
const bookingURL = `booking.html?sport=${sport}&level=${level}`
console.log(bookingURL)
window.location.href = `${bookingURL}`
})


