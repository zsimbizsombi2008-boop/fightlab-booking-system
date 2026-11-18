const form = document.querySelector(".Login")
const usernameInput = document.querySelector(".name-input")
const passwordInput = document.querySelector(".password")
const responseeMessage = document.querySelector(".Response-message")



function Errorcolor(element){
element.classList.remove("success");
element.classList.add("error");
}


function Successcolor(element){
element.classList.remove("error");
element.classList.add("success");
}






form.addEventListener("submit", (event)=>{
event.preventDefault();
responseeMessage.textContent = "";

const username = usernameInput.value.trim();
const password = passwordInput.value.trim();

if(username === "" || password === ""){
responseeMessage.textContent = "Töltsd ki a mezőket!"
return 
}


handleLogin(username, password)
})


async function handleLogin(username, password) {
try{
const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username:username, password:password})
});

if(!response.ok){
const ErrorData = await response.json();
responseeMessage.textContent = ErrorData.error || "Hiba történt!";
Errorcolor(responseeMessage);
console.log(ErrorData);
return
}

const data = await response.json();
responseeMessage.textContent = "Sikeres bejelentkezés!"
Successcolor(responseeMessage);
localStorage.setItem("adminToken", data.token)
window.location.href = "admin.html"
form.reset();
}catch{
responseeMessage.textContent = "Szerverhiba!"
Errorcolor(responseeMessage);
return
}
}