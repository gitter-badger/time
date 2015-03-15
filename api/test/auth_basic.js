var test   = require('tape');
var server = require("../../web.js");
var dir    = __dirname.split('/')[__dirname.split('/').length-1];
var file   = dir + __filename.replace(__dirname, '') + " -> ";

test(file + "POST /login 401 for un-registered person", function(t) {
  var email      = "unregistered@awesome.io";
  var password   = "PinkFluffyUnicorns";
  var authHeader = "Basic " + (new Buffer(email + ':' + password, 'utf8')).toString('base64');
  var options    = {
    method  : "POST",
    url     : "/login",
    headers : { authorization : authHeader }
  };
  server.inject(options, function(res) {
    t.equal(res.statusCode, 401, "Unregistered Cannot Login");
    t.end();
    server.stop();
  });
});

test(file + "Create a new person and log in", function(t) {
  var email      = "auth_basic.tester@awesome.net";
  var password   = "PinkFluffyUnicorns";
  var options = {
    method  : "POST",
    url     : "/register",
    payload : { email: email, password: password }
  };
  server.inject(options, function(res) {
    t.equal(res.statusCode, 200, "Person registration is succesful");
    var authHeader = "Basic " + (new Buffer(email + ':' + password, 'utf8')).toString('base64');
    var options2    = {
      method  : "POST",
      url     : "/login",
      headers : { authorization : authHeader }
    };
    server.inject(options2, function(res) {
      t.equal(res.statusCode, 200, "Login Success!!");
      t.end();
      server.stop();
    });
  });
});
