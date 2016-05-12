/*************** SET UP ***************/
var express  = require('express');
var app = express();                             // create our app w/ express
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');                      // make http get request in express
var exec = require('child_process').exec;        // allow us to execute command lines
var watch = require('node-watch');               // watch files or directories for changes

/*************** CONFIG ***************/
app.use(express.static(__dirname + '/public'));                                     // set the static files location
app.use('/bower_components', express.static(__dirname + '/bower_components'));      // set the bower static files location
app.use(morgan('dev'));                                                             // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));                                // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                                         // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));                     // parse application/vnd.api+json as json
app.use(methodOverride());

/*************** MODEL ***************/

var dataHostURL = "open_preprod.tan.fr"; // development server
//var dataHostURL = "open.tan.fr"; // production server

/*************** WATCH ***************/

// watch main.less for changes, and compile when the file changes
watch('public/less/main.less', function(filename) {
    console.log('[node-watch]', filename, 'changed. Compiling...');
    // we render the main.less file into main.css (minified)
    exec("lessc -x public/less/main.less public/css/main.css", function(error, stdout, stderr) {
        console.log('[node-watch] main.css file compiled.');
        if (stdout !== '') {
            console.log('[node-watch] stdout: ' + stdout);
        }
        if (stderr !== '') {
            console.log('[node-watch] stderr: ' + stderr);
        }
        if (error !== null) {
            console.log('[node-watch] exec error: ' + error);
        }
    });
});

/*************** LISTEN ***************/

app.listen(8080);
console.log("Listening on port 8080");

/*************** ROUTES ***************/

/********** API **********/

// get all arrets
app.get('/api/arrets', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/arrets.json'
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        result.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            res.json(JSON.parse(body));
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

app.get('/api/lignes', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/arrets.json'
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        result.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            // we modify the body for selected only the lines
            var bodyJSON = JSON.parse(body);
            var arrayLines = [];

            for (var i=0; i < bodyJSON.length; i++) {
                for (var j=0; j < bodyJSON[i].ligne.length; j++) {
                    console.log(arrayLines.indexOf(bodyJSON[i].ligne[j]));
                    if (arrayLines.indexOf(bodyJSON[i].ligne[j]) === -1) {
                        arrayLines.push(bodyJSON[i].ligne[j]);
                    }
                }
            }
            res.json(arrayLines);
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

// create todo and send back all todos after creation
/*app.get('/api/lignes', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});
*/

// get all arrets
app.get('/api/arret/:id', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/tempsattente.json/' + req.params.id
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        result.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            // ...and/or process the entire body here.
            res.json(JSON.parse(body));
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

/********** APPLICATION **********/

app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendFile('index.html', { root: __dirname + '/public' });
});
