const PrimaryButton = document.querySelector(".Primary-button");
const RefreshButtonDiv = document.querySelector(".Refresh");
const RefreshButton = document.querySelector(".Refresh-button");
const LogOutButton = document.querySelector(".Logout")
const ButtonResponse = document.querySelector(".ButtonResponse");
const Spinner = document.querySelector(".Spinner");
const ButtonArea = document.querySelector(".Button-Area");
const List = document.querySelector(".List")
const EmptyMessage = document.querySelector(".Empty-message")
const DeleteButton = document.querySelectorAll(".Delete-button");
const Modal = document.querySelector(".Modal")
const modalmessage = document.querySelector(".modal-message")

let isLoading = false
const token = localStorage.getItem("adminToken")

function renderList(users){
  const listContainer = document.querySelector(".List");

  listContainer.innerHTML = users.map(user => 
  `
    <div class="List-item">
      <p><strong>${user.name}</strong> — ${user.sport} (${user.level})</p>
      <p>${user.email} | ${user.phone}</p>
      <p>${user.city}</p>
      <p>${user.age} éves</p>
      <div class="Note-div">
      <p>${user.note.length > 20 ? user.note.slice(0,20) : user.note}</p>
      <button class="MoreButton" type="button" data-full="${user.note}" data-short="${user.note.slice(0,20)}">Bővebben</button>
      </div>
      <div>
      <button class="Delete-button" data-id="${user.booking_id}" type="button">Törlés</button>
      </div>
    </div>
  `).join("");
}

PrimaryButton.addEventListener("click", (event)=>{
event.preventDefault();
ButtonResponse.textContent = ""


getBookings();
})


RefreshButton.addEventListener("click", (event) => {
  event.preventDefault();
  getBookings();
});



List.addEventListener("click", async  (event)=>{


if(event.target.classList.contains("MoreButton")) {    
const button = event.target
const fullNyers = button.dataset.full
let full = ""
 for(let i = 0; i < fullNyers.length; i += 20) {
  const PieceOfFull = fullNyers.slice(i,i+20) ;
  if(PieceOfFull.length >= 20){
  full = full.concat(PieceOfFull + "<br>") ;
  }else{
  full = full.concat(PieceOfFull)
  }
}
const short = button.dataset.short
const Notediv = button.parentElement
const Notetext = Notediv.querySelector("p")
if(button.textContent === "Bővebben"){
button.textContent = "Bezárás"
Notetext.innerHTML = `"${full}"`
}else{
button.textContent = "Bővebben"
Notetext.textContent = `"${short}"`
}
}
})


List.addEventListener("click", async  (event)=>{
modalmessage.textContent = ""

if(event.target.classList.contains("Delete-button")) {    
const button = event.target
const id = button.dataset.id
console.log(id)
try{

const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
      method: "DELETE",
      headers: {"x-admin-secret": token},
});

if(!response.ok){
const ErrorData = await response.json();
modalmessage.textContent = "Hiba történt törléskor!"
Modal.classList.add("activeModal");
setTimeout(()=>{
Modal.classList.remove("activeModal");
}, 3200)
console.log(ErrorData);
return
}
getBookings();
const data = await response.json();
modalmessage.textContent = "Sikeres törlés!"
Modal.classList.add("activeModal");
setTimeout(()=>{
Modal.classList.remove("activeModal");
}, 3200)

console.log(data)

}catch{
modalmessage.textContent = "Szerver hiba!"
Modal.classList.add("activeModal");
setTimeout(()=>{
Modal.classList.remove("activeModal");
}, 3200)
}
}
})


async function getBookings() {
isLoading = true
Spinner.classList.remove("hidden");
PrimaryButton.classList.add("hidden");

 try{
const response = await fetch('http://localhost:8000/api/bookings', {
            method: 'GET',
            headers: {"x-admin-secret": token},
        })

if(!response.ok){
const errorData = await response.json()
console.log(errorData.error)
isLoading = false
PrimaryButton.classList.remove("hidden");
Spinner.classList.add("hidden");
ButtonResponse.textContent = "Hiba történt betöltéskor!"
return false
}
isLoading = false
Spinner.classList.add("hidden")
console.log("Spinner-class:" ,Spinner.classList)
RefreshButtonDiv.classList.remove("hidden");
ButtonArea.classList.add("hidden")
const data = await response.json()
List.classList.remove("hidden")
if(data.UsersLength === 0){
List.classList.add("hidden");
EmptyMessage.classList.remove("hidden")
}else if(data.UsersLength > 0){
EmptyMessage.classList.add("hidden")
}
renderList(data.Users);
console.log(data.message)
return true
 }catch(error){
isLoading = false
PrimaryButton.classList.remove("hidden");
List.classList.add("hidden")
Spinner.classList.add("hidden");
ButtonResponse.textContent = "Szerverhiba!"
RefreshButtonDiv.classList.add("hidden");
console.log(error)
 }finally{
isLoading = false
 }
}


LogOutButton.addEventListener("click", (event)=>{
event.preventDefault();

localStorage.removeItem("adminToken")
window.location.href = "adminLogin.html"
})

