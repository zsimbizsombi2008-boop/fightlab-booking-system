const Sportcards = document.querySelectorAll(".Sports-Grid article")
const header = document.querySelector("header")
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry)=>{
console.log(entry)
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
},
{
threshold:0.2
}
);

Sportcards.forEach((card, index)=>{
card.style.transitionDelay = `${index*100}ms`
observer.observe(card);
})

window.addEventListener("scroll" , ()=>{
if(window.scrollY > 30){
header.classList.add("Scrolled")
}else{
header.classList.remove("Scrolled")
}
})




const Title = document.querySelector(".H1-P")
setTimeout(()=>{
Title.classList.add("show2")
}, 0);


const SportButton = document.querySelector(".Button-Sports")
setTimeout(()=>{
SportButton.classList.add("show3")
}, 800)


const FlippContainer = document.querySelectorAll(".Box-forward-back")
const BoxFront = document.querySelector(".Box-forward")
const BoxBack = document.querySelector(".Box-back")
const Rotate = document.querySelector(".Rotate")
 


FlippContainer.forEach((card) => {
const button = card.querySelector(".PriceButton");
const front = card.querySelector(".Box-forward");

button.addEventListener("click", () => {
card.classList.add("Rotate");

setTimeout(() => {
front.style.visibility = "hidden";
}, 100);
})
});


FlippContainer.forEach((card)=>{
const button = card.querySelector(".Back-Button")
button.addEventListener("click", ()=>{
card.classList.remove("Rotate");
const front = card.querySelector(".Box-forward");

setTimeout(() => {
front.style.visibility = "visible";
}, 100);
})
})


const HamburgerButton = document.querySelector(".hamburgerButton")
const HamburgerMenu = document.querySelector(".hamburgerOptions")


HamburgerButton.addEventListener("click",()=>{
if(!HamburgerMenu.classList.contains("hidden")  ){
HamburgerMenu.classList.add("hidden")
HamburgerButton.classList.remove("hamburgeractive")
}else{
HamburgerMenu.classList.remove("hidden")
HamburgerButton.classList.add("hamburgeractive")
}
})




