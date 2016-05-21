/*************** SET UP ***************/
var express  = require('express');
var app = express();                             // create our app w/ express
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');                      // make http get request in express
var exec = require('child_process').exec;        // allow us to execute command lines
var watch = require('node-watch');               // watch files or directories for changes
var _ = require('underscore');                   // some useful functions for manipulating data
var Q = require("q");                            // use promises to chain functions (especially http get)
var compressor = require('node-minify');         // tool for minifying CSS and JS

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
watch('public/less/style.less', function(filename) {
    console.log('[node-watch]', filename, 'changed. Compiling...');
    // we render the main.less file into main.css (minified)
    exec("lessc -x public/less/style.less public/css/style.css", function(error, stdout, stderr) {
        console.log('[node-watch] style.css file compiled. Running compression...');
        if (stdout !== '') {
            console.log('[node-watch] stdout: ' + stdout);
        }
        if (stderr !== '') {
            console.log('[node-watch] stderr: ' + stderr);
        }
        if (error !== null) {
            console.log('[node-watch] exec error: ' + error);
        }
        // and we compress using yui compressor
        new compressor.minify({
            type: 'yui-css',
            fileIn: 'public/css/style.css',
            fileOut: 'public/css/style.min.css',
            callback: function(err, min){
                console.log('[node-watch] style.css minification done !');
                if (err !== null) {
                    console.log(err);
                }
            }
        });
    });
});

// watch js relative to angular changes, and compile js
watch('public/js/app', function(filename) {
    console.log('[node-watch]', filename, 'changed. Compiling js files...');
    new compressor.minify({
        type: 'uglifyjs',
        fileIn: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/bootstrap-material-design/dist/js/material.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'public/js/app/main.js',
            'public/js/app/app.js',
            'public/js/app/directives.js',
            'public/js/app/services.js',
            'public/js/app/controllers.js'
        ],
        fileOut: 'public/js/script.js',
        callback: function(err, min){
            console.log('[node-watch] script.js compilation done !');
            if (err !== null) {
                console.log(err);
            }
        }
    });
});

/*************** LISTEN ***************/

app.listen(8080);
console.log("Listening on port 8080");

/*************** ROUTES ***************/

/********** API **********/

// get all "arrets"
app.get('/api/arrets', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/arrets.json'
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var body = '';
        result.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            res.json(JSON.parse(body));
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

// get all "arrets" with distance to user (only "arrets" with < 500m distance)
app.get('/api/arrets/:latitude/:longitude', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/arrets.json/' + req.params.latitude.replace('.',',') + '/' + req.params.longitude.replace('.',',')
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var body = '';
        result.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            res.json(JSON.parse(body));
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

// get "lignes" details
app.get('/api/lignes', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/arrets.json'
    };

    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        // Buffer the body entirely for processing as a whole.
        var body = '';
        result.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            var arretsData = JSON.parse(body);
            var lignesData = [];

            // for each "arret", we take the "ligne" number
            arretsData.forEach(function(arret) {
                arret.ligne.forEach(function(ligne) {
                    var alreadyHere = false;
                    // we explore the lignesData and search if the "ligne" is existing
                    for (var i=0; i < lignesData.length; i++) {
                        if (lignesData[i].numLigne === ligne.numLigne) {
                            alreadyHere = true;
                            lignesData[i].arrets.push({
                                codeLieu: arret.codeLieu,
                                libelle: arret.libelle
                            });
                            break;
                        }
                    }

                    // if "ligne" isn't already in the array, insert it with the arret
                    if (!alreadyHere) {
                        lignesData.push({
                            numLigne: ligne.numLigne,
                            arrets: [{
                                codeLieu: arret.codeLieu,
                                libelle: arret.libelle
                            }],
                            showArrets: false
                        });
                    }
                });
            });

            // then, we remove some incorrect "lignes" of the API (1B, 105, LU)
            lignesData = lignesData.filter(function(elt) {
                return ['1B', '105'].indexOf(elt.numLigne) === -1;
            });

            res.json(lignesData);
        });
    });

    tanReq.on('error', function(e) {
      console.log('ERROR: ' + e);
      res.send(e);
    });
});

// get arret details
app.get('/api/arret/:id', function(req, res) {
    var options = {
        host: dataHostURL,
        path: '/ewp/tempsattente.json/' + req.params.id
    };

    // main request
    var tanReq = http.get(options, function(result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));

        var body = '';
        result.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            // init variables
            var arretsData = JSON.parse(body);
            var codesArrets = [];

            // we get the 'codeArret', 'ligne' and 'sens' for the arret
            arretsData.forEach(function(elt) {
                codesArrets.push({
                    'codeArret': elt.arret.codeArret,
                    'ligne': elt.ligne.numLigne,
                    'sens': elt.sens
                });
            });
            // as we have several records for each "arret", we just want one
            codesArrets = _.uniq(codesArrets, 'codeArret');

            // we start to use promises to chain get for all "arret"
            var promises = [];
            codesArrets.forEach(function(elt) {
                var deferred = Q.defer();

                var options = {
                    host: dataHostURL,
                    path: '/ewp/horairesarret.json/' + elt.codeArret + '/' + elt.ligne + '/' + elt.sens
                };

                http.get(options, function(result) {
                    var chunks = '';
                    result.on('data', function(chunk) {
                        chunks += chunk;
                    }).on('end', function() {
                        if (result.statusCode !== 500) {
                            var allChunks = JSON.parse(chunks);
                            // we add the way (sens) of the road
                            allChunks.sens = elt.sens;
                            deferred.resolve(allChunks);
                        } else {
                            deferred.resolve();
                        }
                    });
                });

                promises.push(deferred.promise);
            });

            // launch all the promises and do something when finished
            Q.all(promises)
            .then(function(results) {
                // we clean the array in case we didn't find some data
                results = results.filter(function(n){ return n != undefined });

                // we return the data in a clean way
                var returnData = [];
                results.forEach(function(r) {
                    returnData.push({
                        'ligne': r.ligne.numLigne,
                        'terminus': r.ligne['directionSens' + r.sens],
                        'heure': _.last(r.horaires).heure + _.last(_.last(r.horaires).passages)
                    });
                });

                res.json(returnData);

            }, console.error);
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
