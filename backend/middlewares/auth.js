const ErrorHandler = require("../utils/errorhandler");
const catchasyncErrors = require("./catchasynError");
const jwtToken = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchasyncErrors(async (req, res, next) => {
 if (!req.headers.cookie) {
  return next(new ErrorHandler("Please Login to access this resource", 401));
}
   const token=req.headers.cookie.slice(6);
  //  console.log(token);
    //  const {token}= req.headers.cookie;
      //  console.log( req.headers.cookie.slice(6));
  
     
  
    const decodedData = jwtToken.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
  
    next();
  });
 
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
 