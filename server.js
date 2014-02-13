var formidable = require('formidable'),
    http = require('http'),
    fs = require('fs'),
    connect = require('connect'),
    express = require('express');
    
app = express();
server = http.createServer(app);
server.listen(7020);

var uploadDir = __dirname+"/uploads";

app.get('/',function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
  
  var formHtml = '<form action="/upload" enctype="multipart/form-data" method="post">'+
  '<input type="text" name="title"><br>'+
  '<input type="file" name="upload" multiple="multiple"><br>'+
  '<input type="submit" value="Upload">'+
  '</form>';
  
  var files = fs.readdirSync('./uploads');
  var filesHtml = "<ul>"; 
  
  for(var i in files) {
    var file_name = files[i]; 
    filesHtml += "<li><a href='/uploads/"+file_name+"'>" +file_name+ "</a></li>";
  };
  
  if(filesHtml == "<ul>"){
    filesHtml = "<p><b>No Files</b></p>";
  }

  res.end( formHtml + filesHtml );
});


app.post('/upload', function(req,res) {
  var form = new formidable.IncomingForm();
  
  // set the upload directory. Defaults to OS temp directory.
  form.uploadDir = uploadDir;

  // keep the file extension of the uploaded file 
  form.keepExtensions = true;
    
  // ensure the uploaded file keeps it's original name.
  form.on('fileBegin', function(name, file){
    file.path = form.uploadDir + "/" + file.name;
  });
  
  // redirect the user to "/" after upload is complete.
  form.on('end', function() {
    res.redirect('/');
  });
  
  // form.parse(req) tells the `formidable` library to handle upload.
  form.parse(req);
});

app.use("/uploads", express.static(__dirname + '/uploads'));
