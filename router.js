var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var queryString = require("querystring");

//var commonHeaders = '{'Content-Type' : 'text/plain'}';
//could also change content-type to pdf, jpg, iges, mesh and many more: 
//https://www.iana.org/assignments/media-types/media-types.xhtml

var commonHeaders = {'Content-Type' : 'text/html'};

//2. Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {

	if(request.url === '/') {
		//if url == '/' && GET
		if(request.method.toLowerCase() === "get"){
				// show search
			  response.writeHead(200, commonHeaders);
			  //template files are split up into header, body and footer, as well as one for error msgs
			  renderer.view("header", {}, response);
			  renderer.view("search", {}, response);
			  renderer.view("footer", {}, response);
			  response.end();
			}
			else{
				//if url == '/' && POST
				//get  POST data from  body
				request.on("data", function(postBody){
					console.log(postBody.toString());	//converting the incoming buffer to string
					//extract username
					var query = queryString.parse(postBody.toString());
					console.log(query.username);
				//redirect to :username
					response.writeHead(303, {"Location" : "/" + query.username });
					//response.write(query.username);
					response.end();
				});
			}
	}


}

function user(request, response) {
	//3. Handle HTTP route GET /:username i.e. /jonatanschumacher
	//if url == "/..."
	var username = request.url.replace('/', '');
	if(username.length > 0 && username !== 'favicon.ico') {
	  response.writeHead(200, commonHeaders);
	  renderer.view("header", {}, response);

		var studentProfile = new Profile(username);
		//get json from Treehouse

		//on "end"
		studentProfile.on("end", function(profileJSON){
			//store values we need:
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				fullname: profileJSON.name,
				username: profileJSON.profile_name,
				badges: profileJSON.badges.length,
				javascriptPoints: profileJSON.points.JavaScript
			}
			console.log("\n\nValues:\n" + values + "\n\n");

			//Simple Response:
			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
			//redirect to /:username

		});
				
		//on "error"
		studentProfile.on("error", function(error){
			//show error

	  //template files are split up into header, body and footer, as well as one for error msgs
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});
	}
}


module.exports.home = home;
module.exports.user = user;