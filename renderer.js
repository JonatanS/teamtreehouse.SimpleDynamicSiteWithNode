var fs = require("fs");

function mergeValues(values, content) {
	//cycle over keys
	for (var key in values)
	{
		//replace all {{key}} with the value of the values object
		content = content.replace("{{" + key + "}}", values[key]);
	}
	//return merged content
	return content;
}

//insert CSS with node:
function insertCSS(htmlFile, css) {
	return htmlFile.replace("/*%addCSS*/", css);
}

//read HTML views from the file system and put into the reponse (in router.js)
function view(templateName, values, response) {
	//read from the template files, using teh blocking method. This is because we are rendering this out as html
	var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'});
  	//if (error) throw error;
	//insert values into the content
	var myCss = fs.readFileSync('./css/myStyle.css', {encoding: 'utf8'});
	
	fileContents = insertCSS(fileContents,myCss);
	fileContents = mergeValues(values, fileContents);
	console.log("\n\nFile Contents\n" + fileContents + "\n\n");
	//write out to the response
	response.write(fileContents);	
}

module.exports.view = view;