const transporter = require("../config/mail")



async function EmailSender(email,name,sport,level,bookingId,token) {
 try{
 await transporter.sendMail({
from:"bulizz.app@gmail.com",
to:`${email}`,
subject:"Viszzaigazolás.",
text: `Szia ${name} sikeresen jelentkleztél ${sport} edzésre ${level} szintre!`,
html:`<p><strong>Sikeres foglalás:</strong><br>
       Id:${bookingId}<br>
       Név:${name}<br>
       Sport:"${sport}<br>
       Szint:"${level}</p>
<a href="http://localhost:8000/api/email-verify?token=${token}&id=${bookingId}" 
style= "display:inline-block; padding:10px 16px; background-color:black;
color:white;border:1px solid white;border-radius:18px;
font-size:18px;text-decoration:none; cursor:pointer; ">Megerősítés</a>
       `
 })
 }  catch(error){
console.log(error);
throw error
 }
}


module.exports = EmailSender