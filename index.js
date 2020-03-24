var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var users = [];
var onLineuser = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  users.push(socket);
  console.log("New user connected " + users.length);

  socket.on("disconnect", function(sock) {
    onLineuser.splice(onLineuser.indexOf(socket.username), 1);
    console.log("Disconnect user " + users.length);
  });

  socket.on("new user", function(data) {
    socket.username = data;
    onLineuser.push(socket.username);
    console.log("user connected " + socket.username);
    updateuser();
  });

  socket.on("msg", function(name, msg) {
    io.sockets.emit("resmsg", { name: name, msg: msg });
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  function updateuser() {
    io.sockets.emit("get user", onLineuser);
    //   socket.on("get user", function(){
    //       io.sockets.emit("get user",onLineuser);
    //   })
  }
});

http.listen(3000, function() {
  console.log("Server created with port 3000");
});
