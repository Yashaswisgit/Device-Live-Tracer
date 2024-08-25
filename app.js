const express = require('express');
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    console.log("A user connected:", socket.id);

    socket.on("send-location", function(data){
        io.emit("received-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
        console.log("A user disconnected:", socket.id);
    });
});

app.get("/", function (req, res){
    res.render("index");
});

server.listen(3000, function(){
    console.log("Server is running on port 3000");
});
