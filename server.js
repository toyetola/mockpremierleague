const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// var redis   = require("redis");
var session = require('express-session');
// var redisStore = require('connect-redis')(session);
// var client  = redis.createClient();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



const db = require("./app/models/index");
const url= "mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/mockpremierleague?retryWrites=true&w=majority"
// return console.log(db);
db.mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  //session middleware 
  const checkSession = (req, res, next) => {
      if(!req.session.theuser){
        res.json({'Access denied': 'Please login again'})
      }else{
        next();
      }
  }


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const adminDashboardRoutes = require("./routes/adminDashboard");
const freeRoutes = require("./routes/freeRoutes");
const verifyToken = require("./routes/validate-token");


//redis
app.use(session({ secret: 'keyboard', cookie: { maxAge: 3600000}, resave:true , saveUninitialized:true}))

// route middlewares
app.use("/api/user", authRoutes);
app.use("/api/admin", authRoutes);

// this route is protected with token
app.use("/api/user/dashboard", verifyToken, checkSession, dashboardRoutes);
app.use("/api/admin/dashboard", verifyToken, checkSession, adminDashboardRoutes);

//unprotected routes
app.use("/api/search", freeRoutes);

module.exports = app