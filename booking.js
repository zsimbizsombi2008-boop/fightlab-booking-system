
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const ageInput = document.querySelector("#age");
const cityInput = document.querySelector("#city");
const noteInput = document.querySelector("#note");
const Succesmessage = document.querySelector(".Success-message p");
const SuccesBox = document.querySelector(".Success-message");
const Nameerror = document.querySelector("#name-error")
const Emailerror = document.querySelector("#email-error")
const Ageerror = document.querySelector("#age-error")
const Phoneerror = document.querySelector("#phone-error")
const Cityerror = document.querySelector("#city-error")
const Noteerror = document.querySelector("#note-error")
const Sporttext = document.querySelector(".Sport-p")
const Leveltext = document.querySelector(".Level-p")
const BackButton = document.querySelector("header a")





function showError(input, errorElement,message){
input.classList.add("error");
errorElement.textContent = message
}

function clearError(input, errorElement){
input.classList.remove("error");
errorElement.textContent = "";
}





form.addEventListener("submit", (event)=>{
event.preventDefault();

Succesmessage.textContent = "";


const name = nameInput.value.trim();
const email = emailInput.value.trim();
const phone = phoneInput.value.trim();
const age = ageInput.value.trim();
const city = cityInput.value.trim();
const note = noteInput.value.trim();

const ageNumber = Number(age);


const phonePattern = /^[0-9+ ]+$/;

let isValid = true

if(name===""){
showError(nameInput, Nameerror, "Add meg a neved!")
isValid = false


}else{
clearError(nameInput, Nameerror)
};
if(age==="" || ageNumber < 14 || ageNumber > 99){

showError(ageInput, Ageerror, "Add meg az életkorod!")
isValid = false

}else{
clearError(ageInput, Ageerror)
};
if(email==="" || !email.includes("@")){

showError(emailInput, Emailerror, "Add meg az emailed!")
isValid = false

}else{
clearError(emailInput, Emailerror)
};
if(phone==="" || phone.length < 9 || !phonePattern.test(phone)){

showError(phoneInput, Phoneerror, "Add meg a telefonszámod!")
isValid = false

}else{
clearError(phoneInput, Phoneerror)
};
if(city===""){

showError(cityInput, Cityerror, "Add meg a városod!")
isValid = false

}else{
clearError(cityInput, Cityerror)
};

if(note.length > 500){
showError(noteInput, Noteerror, "500 karakternél nem lehet hosszabb a megjegyzés!")
}else{
clearError(noteInput,Noteerror)
}

if(isValid === true){
Succesmessage.textContent = "Sikeres foglalás!" 
SuccesBox.classList.add("success-message")
SuccesBox.classList.remove("error-message")
form.reset();

const bookingData = {
 level,
 sport,
 name,
 email,
 phone,
 age,
 city, 
 note
}

createBooking(bookingData);
console.log(bookingData)
}



})

const params = new URLSearchParams(window.location.search)

const sport = params.get("sport")
const level = params.get("level")

const levelNames = {
Beginner: "Kezdő",
Advanced: "Haladó",
Competetive: "Versenyzői",
Private: "Magán"

}


const sportEmojis = {
Box: "🥊",
BJJ: "🥋",
"Muay-thai": "🥊",
K1: "🥊",
Wrestling: "🥋",
MMA:"🥋🥊"

}


const EMOJI = sportEmojis[sport]

const selectedLevel = levelNames[level]

Sporttext.textContent = `${sport} ${EMOJI}`

Leveltext.textContent = selectedLevel




const sportPages = {
Box: "./box-detail.html",
BJJ: "./BJJ-detail.html",
"Muay-thai": "./muay-thai-detail.html",
K1: "./k1-detail.html",
Wrestling: "./wrestling-detail.html",
MMA:"./MMA-detail.html"

}


const BeforePage = sportPages[sport]


BackButton.href = BeforePage


console.log("sport :", sport)
console.log("emoji :", EMOJI)


async function createBooking(bookingData) {

    try {
        
        const response = await fetch('http://localhost:8000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(bookingData) 
        });

        const data = await response.json();

        if (!response.ok) {
            Succesmessage.textContent = data.error || "Foglalási hiba." 
            SuccesBox.classList.add("error-message");
               SuccesBox.classList.remove("success-message")
            return false
        }

       Succesmessage.textContent = data.message || "Sikeres foglalás, küldtünk egy emailt erősitsd meg a véglegesítéshez."
        SuccesBox.classList.add("success-message")
          SuccesBox.classList.remove("error-message");
       return true

    } catch (error) {
        Succesmessage.textContent = "Szerver hiba."
        SuccesBox.classList.add("error-message")
        SuccesBox.classList.remove("success-message")
        console.error('Hiba történt a küldés során:', error);
    }
}



