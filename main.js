var http = require('http');
var fs = require('fs');
var url = require("url");

function templateHTML(title, list, body) {
    return `        
    <!doctype html>
<html>
<head>
<title>WEB1 -${title}</title>
<meta charset="utf-8">
</head>
<body>
<h1><a href="/">WEB</a></h1>
${list}
${body}
</body>
</html> 
`;
}

function templateList(filelist) {
    var list = "<ul>"
    var i = 0;
                while (i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list + "</ul>";
                return list;
}

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // ? 뒤에 부분을 가져오게 하는 parse()
    var pathname = url.parse(_url, true).pathname;

    console.log(queryData.id); // id 출력

    if (pathname === "/") {
        if (queryData.id === undefined) {

            fs.readdir("./data", function (error, filelist) {
                console.log(filelist);
                var title = "Welcome";
                var description = "Hello, Node.js";
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template); // 서버에 template 를 보여줌
            })


        } else {
            fs.readdir("./data", function (error, filelist) {
                console.log(filelist);
                fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
                    var title = (queryData.id);
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template); 
                });
            });
        }

    } else {
        response.writeHead(404);
        response.end("Not Found");
    }

});
app.listen(3000);