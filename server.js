var fs = require('fs'),
  http = require('http');

var server = http.createServer(function (req, res) {
  fs.readFile(__dirname + req.url, function (err, data) {
    console.log(req.url);
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    var isJs = req.url.indexOf('.js') !== -1;
    res.writeHead(200, { 'Content-Type': isJs ? 'text/javascript' : 'text/html' });
    res.end(data);
  });
});

server.listen(8080);
console.log('Server listening on 8080')

const io = require('socket.io').listen(server);
io.on('connection', function (client) {
  console.log("Socket connection is ON!");
  io.on('disconnect', () => {
    console.log('user disconnected');
  });
});

fs.watch('index.html', function (curr, prev) {
  // file changed push this info to client.
  console.log("file Changed");
  io.emit('fileChanged', 'yea file has been changed.');
});

fs.watch('./client', function (curr, prev) {
  // file changed push this info to client.
  console.log("file Changed");
  io.emit('fileChanged', 'yea file has been changed.');
});
