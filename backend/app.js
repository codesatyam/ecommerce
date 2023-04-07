const express=require("express");
const app=express();
const cookieParser = require("cookie-parser");


const middleware=require("./middlewares/error");
app.use(express.json());

// router here
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
const order=require("./routes/orderRoutes");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use(cookieParser());
//middleware here for error
app.use(middleware);

module.exports=app;