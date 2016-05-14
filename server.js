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
var onlineMode = false;
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

if (onlineMode === true) {
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

    // get lines details
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

    // get arret details
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
} else {
    app.get('/api/arrets', function(req, res) {
        var response = '[{"codeLieu":"OTAG","libelle":"50 Otages","distance":null,"ligne":[{"numLigne":"52"},{"numLigne":"12"},{"numLigne":"63"},{"numLigne":"2"},{"numLigne":"32"}]},{"codeLieu":"HMVE","libelle":"8 Mai","distance":null,"ligne":[{"numLigne":"28"},{"numLigne":"42"}]},{"codeLieu":"MAI8","libelle":"8 Mai","distance":null,"ligne":[{"numLigne":"3"},{"numLigne":"98"},{"numLigne":"97"}]},{"codeLieu":"ABDU","libelle":"Abel Durand","distance":null,"ligne":[{"numLigne":"25"}]},{"codeLieu":"AECL","libelle":"Aéroclub","distance":null,"ligne":[{"numLigne":"NA"}]},{"codeLieu":"AEPO","libelle":"Aéroport","distance":null,"ligne":[{"numLigne":"98"}]},{"codeLieu":"AESP","libelle":"Aérospatiale","distance":null,"ligne":[{"numLigne":"98"}]},{"codeLieu":"AIGU","libelle":"Aiguillon","distance":null,"ligne":[{"numLigne":"92"},{"numLigne":"75"},{"numLigne":"71"},{"numLigne":"83"},{"numLigne":"82"}]},{"codeLieu": "ADEL","libelle":"AiméDelrue","distance":null,"ligne":[{"numLigne":"3"},{"numLigne":"2"}]},{"codeLieu":"AIBU","libelle":"Airbus","distance":null,"ligne":[{"numLigne":"98"}]},{"codeLieu":"ALIE","libelle":"Allier","distance":null,"ligne":[{"numLigne":"61"},{"numLigne":"58"},{"numLigne":"24"}]},{"codeLieu":"APRE","libelle":"AmbroiseParé","distance":null,"ligne":[{"numLigne":"56"},{"numLigne":"65"},{"numLigne":"59"}]},{"codeLieu":"AMER","libelle":"Américains","distance":null,"ligne":[{"numLigne":"12"},{"numLigne":"63"},{"numLigne":"32"}]},{"codeLieu":"AMPE","libelle":"Ampère","distance":null,"ligne":[{"numLigne":"86"},{"numLigne":"63"}]},{"codeLieu":"AFRA","libelle":"AnatoleFrance","distance":null,"ligne":[{"numLigne":"22"},{"numLigne":"51"},{"numLigne":"54"},{"numLigne":"65"}]},{"codeLieu":"AGVI","libelle":"Angevinière","distance":null,"ligne":[{"numLigne":"54"},{"numLigne":"73"}]},{"codeLieu":"ACHA","libelle":"AngleChaillou","distance":null,"ligne":[{"numLigne":"96"}]},{"codeLieu":"AGTE","libelle":"Angleterre","distance":null,"ligne":[{"numLigne":"61"},{"numLigne":"58"},{"numLigne":"56"},{"numLigne":"24"}]},{"codeLieu":"ATAR","libelle":"Antarès","distance":null,"ligne":[{"numLigne":"78"}]},{"codeLieu":"ATIL","libelle":"Antilles","distance":null,"ligne":[{"numLigne":"58"},{"numLigne":"64"}]},{"codeLieu":"ANTO","libelle":"Antons","distance":null,"ligne":[{"numLigne":"80"}]},{"codeLieu":"APAV","libelle":"Apave","distance":null,"ligne":[{"numLigne":"93"}]},{"codeLieu":"AMOR","libelle":"ArMor","distance":null,"ligne":[{"numLigne":"84"}]},{"codeLieu":"ARAG","libelle":"Arago","distance":null,"ligne":[{"numLigne":"95"}]},{"codeLieu":"ARBO","libelle": "Arbois","distance":null,"ligne":[{"numLigne":"59"}]},{"codeLieu":"ARCA","libelle":"Arcades","distance":null,"ligne":[{"numLigne":"81"},{"numLigne":"91"}]},{"codeLieu":"ARGO","libelle":"Argonautes","distance":null,"ligne":[{"numLigne":"85"}]}]';
        res.json(JSON.parse(response));
    });

    app.get('/api/lignes', function(req, res) {
        var response = '[{"sens":1,"terminus":"Gréneraie","infotrafic":false,"temps":"3mn","ligne":{"numLigne":"36","typeLigne":3},"arret":{"codeArret":"BILE1"}},{"sens":2,"terminus":"Neustrie","infotrafic":false,"temps":"30mn","ligne":{"numLigne":"36","typeLigne":3},"arret":{"codeArret":"BILE2"}},{"sens":1,"terminus":"Gréneraie","infotrafic":false,"temps":"33mn","ligne":{"numLigne":"36","typeLigne":3},"arret":{"codeArret":"BILE1"}}]';
        res.json(JSON.parse(response));
    });

    app.get('/api/arret/:id', function(req, res) {
        var response = '{"arret":{"codeArret":"PIRA1","libelle":"Pirmil","est_accessible":true},"prochainsParcours":[{"terminus":"La Herdrie","temps":"30 mn"},{"terminus":"La Herdrie","temps":"1h02"}],"ligne":{"numLigne":"27","directionSens1":"La Herdrie","directionSens2":"Pirmil","accessible":true,"etatTrafic":"1","libelleTrafic":"Service normal"},"codeCouleur":"J","plageDeService":"Des horaires adapt\u00e9s aux rythmes de vos journ\u00e9es\r\nEn p\u00e9riode scolaire...\r\nJour rose : du lundi au vendredi (hors 18 mai).\r\nJour vert : les samedis.\r\nJour bleu : les dimanches et jours f\u00e9ri\u00e9s (aucun service le 1er mai).\r\nPendant les vacances scolaires...\r\nJour jaune : du lundi au vendredi (hors vacances de Toussaint).","horaires":[{"heure":"6h","passages":["47"]},{"heure":"7h","passages":["07","22","37","56"]},{"heure":"8h","passages":["16","34","58"]},{"heure":"9h","passages":["27","58"]},{"heure":"10h","passages":["30"]},{"heure":"11h","passages":["02","35"]},{"heure":"12h","passages":["06","38"]},{"heure":"13h","passages":["10","42"]},{"heure":"14h","passages":["14","46"]},{"heure":"15h","passages":["18","50"]},{"heure":"16h","passages":["21","53"]},{"heure":"17h","passages":["23","42"]},{"heure":"18h","passages":["01","23","44"]},{"heure":"19h","passages":["04","25","50"]},{"heure":"20h","passages":["18"]}],"prochainsHoraires":[{"heure":"12h","passages":"06"},{"heure":"12h","passages":"38"}]}';
        res.json(JSON.parse(response));
    });
}


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



/********** APPLICATION **********/

app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendFile('index.html', { root: __dirname + '/public' });
});
