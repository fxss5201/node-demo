var fs = require("fs"),
    formidable = require("formidable");
    
function start(response){
    console.log("Request handler 'start' was called.");
    var body = `<html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
                    </head>
                    <body>
                        <form action="/upload" enctype="multipart/form-data" method="post">
                            <input type="text" name="user" />
                            <input type="password" name="password" />
                            <textarea name="description" rows="20" cols="60"></textarea>
                            <input type="file" name="upload">
                            <input type="submit" value="upload file" />
                        </form>
                    </body>
                </html>`;
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(body);
    response.end();
}
function upload(response, request){
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.uploadDir='tmp';
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write("You've sent the user:"+ fields.user + " password:" + fields.password + " description:" + fields.description + "<br/>");
        fs.renameSync(files.upload.path, "./tmp/test.jpg");
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}
function show(response){
    console.log("Request handler 'show' was called.");
    fs.readFile("./tmp/test.jpg", "binary", function(error, file){
        if(error){
            response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200, {"Content-Type": "image/jpg; charset=utf-8"});
            response.write(file, "binary");
            response.end();
        }
    })
}


exports.start = start;
exports.upload = upload;
exports.show = show;