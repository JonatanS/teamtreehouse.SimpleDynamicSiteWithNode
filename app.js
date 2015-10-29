//Problem: We need a simple way to look at a user's badge count and JavaScript point from a web browser
//Solution: Use Node.js to perform the profile look ups and serve our templates via HTTP 
var router = require('./router.js');

//1. Create a web server
var http = require('http');
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type' : 'text/plain'});
  router.home(request, response);
  router.user(request, response);
}).listen(1337, '127.0.0.1');	//local IP address assigned to all computers
//}).listen(3000); //leave out second argument if not listening to server on local machine
console.log("server running at http://127.0.0.1:1337/");
