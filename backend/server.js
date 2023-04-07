const app = require("./app");

const dotenv = require("dotenv");
const { path } = require("./app");
// uncaught rejection handle
process.on("uncaughtException",err=>{
console.log(`Error:${err.message}`);
    console.log("shutting Down server due to uncaught error");

 
     process.exit(1);
});
 
//     
   
 
// database
const connectDatabase=require("./database")

// config
dotenv.config({ path: "./backend/config/config.env" });

//connect database
connectDatabase();
 
const server=app.listen(process.env.PORT, () => {
  console.log(`server is running at port ${process.env.PORT}`);
});

process.on("unhandledRejection",(err)=>
{
   console.log(`Error:${err.message}`);
   console.log("shutting Down server due to unhandle promise error");

   server.close(()=>
   {
    process.exit(1);
   });
});
