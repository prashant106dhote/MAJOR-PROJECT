
const User = require("../models/user.js")

module.exports.renderSignupForm = (req,res)=>{
   res.render("users/singup.ejs");  
}



module.exports.signup = async(req,res)=>{

  try{
    let { username,email,password} = req.body;
   const newUser = new User({email,username});
   const registerUser = await User.register(newUser,password);
   console.log(registerUser);
   req.login(registerUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Welcome to Wonderlust!");
   res.redirect("/listings");
   })
   
  }
  catch(e){
   req.flash("error",e.message);
   res.redirect("/singup")
  }

   
}
 
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.Login  = async(req,res)=>{
req.flash("success","welcome to wonderlust");
let redirectUrl = res.locals.redirectUrl || "/listings"
res.redirect(redirectUrl)
}

module.exports.Logout = (req,res)=>{
  req.logout((err)=>{
    if(err){
      next(err)
    }
    req.flash("success","You are logged out!")
    res.redirect("/listings")
  })
}