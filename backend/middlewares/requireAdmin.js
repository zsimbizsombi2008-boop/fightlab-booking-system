function requireAdmin(req,res,next){
const key = req.headers["x-admin-secret"];
if(!key || key !== process.env.ADMIN_KEY){
return res.status(409).json ({error:"Nincs jogosultságod!"})
}
next()
}






module.exports = requireAdmin