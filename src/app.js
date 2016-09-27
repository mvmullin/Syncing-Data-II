const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

app.listen(port);

const io = socketio(app);

var movRad = 5;

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('drawn', data);
  });
  
  socket.on('movement', (data) => {
    
    const time = new Date().getTime();
    data.coords.lastUpdate = time;
        
    if(data.keysDown[38] && data.keysDown[39]) {
      data.coords.x += Math.cos(45*Math.PI/180) * movRad;
      data.coords.y -= Math.sin(45*Math.PI/180) * movRad;
    }
        
    else if(data.keysDown[38] && data.keysDown[37]) {
      data.coords.x -= Math.cos(45*Math.PI/180) * movRad;
      data.coords.y -= Math.sin(45*Math.PI/180) * movRad;
    }
        
    else if(data.keysDown[37] && data.keysDown[40]) {
      data.coords.x -= Math.cos(45*Math.PI/180) * movRad;
      data.coords.y += Math.sin(45*Math.PI/180) * movRad;
    }
        
    else if(data.keysDown[39] && data.keysDown[40]) {
      data.coords.x += Math.cos(45*Math.PI/180) * movRad;
      data.coords.y += Math.sin(45*Math.PI/180) * movRad;
    }
        
    else if(data.keysDown[37]) {
      data.coords.x -= movRad;
    }
        
    else if(data.keysDown[39]) {
      data.coords.x += movRad;
    }
        
    else if(data.keysDown[38]) {
      data.coords.y -= movRad;
    }
        
    else if(data.keysDown[40]) {
      data.coords.y += movRad;
    }
    
    io.sockets.in('room1').emit('move', data);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`Listening on 127.0.0.1: ${port}`);
