require("dotenv").config()
const express = require("express");
const cors = require("cors");
const pool = require("./config/db")
const requireAdmin = require("./middlewares/requireAdmin")
const EmailSender = require("./services/nodemailer")
const rateLimit = require("express-rate-limit")
const crypto = require("crypto");
const { error } = require("console");



const app = express();

app.use(cors());
app.use(express.json());


// request can be made in windowMS time.
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: "Túl sok kérést csináltál várj 1órát"
});

const PostLimiter = rateLimit({
max:15,
windowMs: 30 * 60 * 1000,
message: "Túl sok kérést csináltál várj 30 percet"
})


app.use(limiter);

async function testDatabaseConnection() {
try {
const [rows] = await pool.query("SELECT VERSION() AS version");

console.log("MySQL connected!");
console.log("MySQL version:", rows[0].version);
} catch (err) {
console.error("MySQL connection failed:", err);
}
}

testDatabaseConnection();

const bookers = [];
console.log(bookers)


const phoneRegex = /^\+?[0-9]([ ]?[0-9])*$/



function checkBookers(email, phone, sport, level){
  return bookers.some((user) => 
    (user.Email === email || user.Phone === phone) &&
    user.Sport === sport &&
    user.Level === level
  );
}




function checkPhone(phone){
if(!phoneRegex.test(phone) || phone.length < 9){
return false
}else{
return true
}

}



app.post("/api/login", (req,res) =>{
try{
const {username,password} = req.body

if(!username || !password){
return res.status(400).json ({error:"Töltsd ki a formot!"})
}

if(username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD){
return res.status(401).json ({error:"Nincs jogosultságod"})
}

return res.status(200).json ({token: process.env.ADMIN_KEY})
}catch(error){
return res.status(500).json ({error:"Hálózati hiba."})
}

});



app.get("/api/email-verify", async (req,res) =>{
try{
const token = req.query.token
const id = req.query.id
if(!token || !id){
return res.status(400).json ({error:"Nincs token"})
}

const [TokenCheck] = await pool.query("SELECT * FROM bookings WHERE id = ? AND confirmation_token = ? ",
  [id,token]
)

if(TokenCheck.length === 0 ){
return res.status(404).json ({error:"Hibás vagy lejért token!"})
}

await pool.query("UPDATE bookings SET status = ? WHERE id = ?",
  ["confirmed",id]
)
res.redirect("http://127.0.0.1:5500/html/confirmation.html")
}catch{
return res.status(500).json ({error:"Hálózati hiba."})
}
});






app.post("/api/bookings",PostLimiter, async (req, res) => {
try {
const {
sport,
level,
name,
email,
phone,
city,
age,
note = ""
} = req.body;

// Kötelező mezők ellenőrzése
if (!sport || !level || !name || !email || !phone || !city || !age) {
return res.status(400).json({
error: "Hiányzó adat!"
});
}
const allowedLevels = [
"Beginner",
"Advanced",
"Competitive",
"Private"
];

if (!allowedLevels.includes(level)) {
return res.status(400).json({
error: "Nincs ilyen fajta edzés."
});
}

if (!email.includes("@")) {
return res.status(400).json({
error: "Hibás email formátum."
});
}

const numericAge = Number(age);

if (numericAge < 14 || numericAge > 99) {
return res.status(400).json({
error: "Hibás életkor."
});
}

if (!checkPhone(phone)) {
return res.status(400).json({
error: "Hibás telefonszám."
});
}

if (note.length > 500) {
return res.status(400).json({
error: "500 karakternél nem lehet hosszabb."
});
}

// 1. Megnézzük, létezik-e már a user
const [users] = await pool.query(
`SELECT id
FROM users
WHERE email = ? OR phone = ?`,
[email, phone]
);

let userId;

// 2. Ha létezik, használjuk a meglévő ID-ját
if (users.length > 0) {
userId = users[0].id;
} else {
// 3. Ha még nem létezik, létrehozzuk
const [insertUserResult] = await pool.query(
`INSERT INTO users
(name, email, phone, city, age, note)
VALUES (?, ?, ?, ?, ?, ?)`,
[
name,
email,
phone,
city,
numericAge,
note
]
);

userId = insertUserResult.insertId;
}

// 4. Megnézzük, hogy ennek a usernek
// van-e már ugyanez a bookingja
const [existingBookings] = await pool.query(
`SELECT id
FROM bookings
WHERE user_id = ?
AND sport = ?
AND level = ?`,
[userId, sport, level]
);

if (existingBookings.length > 0) {
return res.status(409).json({
error: "Már jelentkeztél erre az edzésre."
});
}

const token = crypto.randomBytes(32).toString("hex");

// 5. Ha nincs ilyen booking, létrehozzuk
const [bookingResult] = await pool.query(
`INSERT INTO bookings
(sport, level, status, confirmation_token, user_id)
VALUES (?,?,?,?,?)`,
[sport, level,"pending",token,userId]
);

const bookingId = bookingResult.insertId;


try{
await EmailSender(email,name,sport,level,bookingId,token)
}catch{
console.log("error:", "Szerver oldali hiba történt az email küldésekor.")
}

return res.status(201).json({
message: "Sikeres foglalás!",
bookingId: bookingId,
userId: userId
});

} catch (error) {
console.error(error);

return res.status(500).json({
error: "Szerverhiba."
});
}
});
 


app.get("/api/bookings", requireAdmin, async (req, res) => {
  try {
    const [countResult] = await pool.query("SELECT COUNT(*) AS total FROM bookings");
    const totalCount = countResult[0].total;

    const [users] = await pool.query(
      "SELECT bookings.id AS booking_id, users.id AS user_id, users.name, users.email, users.phone, users.city, users.age, users.note, bookings.sport, bookings.level FROM bookings INNER JOIN users ON users.id = bookings.user_id"
    );

    return res.status(200).json({
      UsersLength: totalCount,
      Users: users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Hálózati hiba." });
  }
});


app.delete("/api/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Nincs ilyen felhasználó akit törölnél." });
    }

    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nincs ilyen foglalás!" });
    }

    return res.status(200).json({ message: "Sikeres törlés!" });

  } catch (error) {
    return res.status(500).json({ error: "Hálózati hiba." });
  }
});




app.listen(8000, () => {
console.log(`A szerver fut a ${8000}-es porton.`);
});

