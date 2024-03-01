var EJS =require('ejs')
require('dotenv').config()
var express =require('express')
var expressLayouts =require('express-ejs-layouts')
var {ROUTER} =require("./route/home.route.js")
var axios =require('axios')
var session =require('express-session')
var flash = require('req-flash')
var multer =require('multer')
var upload =multer({dest:'uploads/'})

const uri =process.env.URI

var {connectDB} =require('./mongooseBD/connectDB.js')

//enable parsing incoming request with urldecode page
function runServer(){
    const app =express()
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    // enable parsing json
   

    //setting static directory
    app.use(express.static(`public`))
  

    // Session
    // app.use(session({secret:'123',resave:false,saveUninitialized:false}))
    // app.use(flash())

    //EJS setting
    app.use(expressLayouts)
    app.set('layout','./layouts/main')
    app.set('view engine','ejs')
    // Using for reading image | uri :http://localhost:3000/images/using express.static
    app.use("/images",express.static('route/uploads'))

   
    //route middleware
    app.use(ROUTER)
    app.use("*",(req,res)=>{
        res.send("Not found this PAGE")
    })

    app.listen(3000,(err)=>{
        if(err)console.log("server was not exist")
        console.log("Server are listening on 3000 port")
    })

}
(async ()=>{
    try{
        await connectDB(uri)
        runServer()
    }catch(err){
        console.log(err.message)

    }
   
})()

