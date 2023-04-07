const Errorhandler=require("../utils/Errorhandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server error";


    if(err.name==="CastError")
    {
      const message=` resouce not found ${err.path}`;
      err=new Errorhandler(message,400);
    }

    // duplictae erroe
    if(err.code===11000)
    {
      const message=`You have entered duplicate ${Object.keys(err.keyValue) }`;
      err=new Errorhandler(message,400);
    }

    // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }
    res.status(err.statusCode).json({
           succuss:false,
           message:err.message
    });
};