"use strict";

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const favicon = require("serve-favicon");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();
const compression = require("compression");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const routes = require("./routes.js");


app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(favicon(path.join(__dirname, "public/ry.png")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("views", path.join(__dirname, "public/views"));
app.engine(".hbs", exphbs({
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  partialsDir: path.join(__dirname, "public/views/partials"),
  extname: ".hbs"
}));
app.set("view engine", ".hbs");
app.use(helmet());
app.use(morgan("dev"));
app.set("PORT", process.env.PORT|| 7678);
app.set("NODE_ENV", process.env.NODE_ENV || "development");

var lifeTimeVisitorData = {};
var setOfVisitorData = {};


io.on("connection", function(socket){
  console.log("Connection");

  socket.on("visitor-data", function(userData){
    setOfVisitorData[socket.id] = userData;
    console.log(userData);
    console.log(setOfVisitorData);
  });

  socket.on("disconnect", function(){
    console.log("Disconnection");
    delete setOfVisitorData[socket.id];
  });
});


app.use("/", routes);

http.listen(app.get("PORT"), function(){
  console.log("Your Node Email Application is listening on port: %s.", app.get("PORT"));
  console.log("Environment: %s", app.get("NODE_ENV"));
});
