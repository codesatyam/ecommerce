const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwtToken=require("jsonwebtoken");
const crypto=require("crypto");

const userScheme=new mongoose.Schema({
 
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[25,"Name should not exceed 25 character"],
        minLength:[3,"Name should more than 2 character"],
    },
    email:{
        type:String,
        required:[true,"Please enter your name"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email"],
    },
    password:{
        type:String,
        require:[true,"Please enter your password"],
        minLength:[8,"Password should be graeter than 7 charater"],
        select:false,
    },
    avatar:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userScheme.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 8);
  });


//token
userScheme.methods.getJWTtoken= function(){
    return jwtToken.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}
// compare password
userScheme.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
// reset password token
userScheme.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
module.exports= mongoose.model("user",userScheme);