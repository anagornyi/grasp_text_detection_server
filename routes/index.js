var mongo = require('mongodb')
  , fs = require('fs');
		
var db = new mongo.Db('text_detection', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {native_parser : true});

exports.upload = function(req, res) {
  var name = req.files.file.name;
  var gs = mongo.GridStore(db, name, 'w');
  
  fs.readFile(req.files.file.path, function(err, img){
    if (err) {
       res.send(err);
    } else {
      gs.writeFile(req.files.file.path, function(err, success){
        if(err) {
          res.send(err);
        } else {
          res.send("Uploaded.\n");
        }
        fs.unlink(req.files.file.path);
        gs.close(function(){});
      });
    } 
  });
};

exports.retrieve = function(req, res) {
  var name = req.headers.filename;  
  var gs = mongo.GridStore(db, name, 'r');
  gs.open(function(err, gs){
    if(err) {
      res.send(err);
    } else {
      gs.read(function(err, data){
        if(err) {
          res.send(err);
        } else {
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.end(data, 'binary');
        }
        gs.close(function(){});
      });
		}
	});
}
