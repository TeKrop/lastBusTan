# Last Bus Tan
![Mockup LastBusTan](https://dl.dropboxusercontent.com/u/28570337/lastbustan/mockup_github.jpg)

## Development dependencies
less : `npm install -g less`

## Install and run
```
npm install
npm install -g bower
bower install
node server.js
```

## Development environment
I'm using some node modules in order to improve the development and the website loading time. Here is the list of the main modules :
- [**express**](https://www.npmjs.com/package/express), for quick and easy setup
- [**bower**](https://www.npmjs.com/package/bower), for managing front-end javascript libraries
- [**node-watch**](https://www.npmjs.com/package/node-watch), for watching less and js code modification, and compile into a minified file each time I modify a file
- [**node-minify**](https://www.npmjs.com/package/node-minify), for minification of css and js files previously compiled
- [**underscore**](https://www.npmjs.com/package/underscore), for several useful functions, allowing to write small code for big data manipulation
- [**q**](https://www.npmjs.com/package/q), a library for promises 
- [**compression**](https://www.npmjs.com/package/compression), for gzip/deflate server compression
- [**helmet**](https://www.npmjs.com/package/helmet), for security of the app by setting various HTTP headers

## Project structure
The project is divided in two parts :

- the back-end (server), with development configuration, basic web server, and API server. In fact, it was a choice to make the calls to the TAN API server-side, and then transform the data in a format I exploit in front-end. Here are the main reasons : lighten the js computing client-side, allow anyone to build an application (Android, iOS, Windows Phone, ...) based on the API of the server, ... I understand that there will be a lot of calls to the TAN API from the server, but it's only an issue when we have a lot of clients, and that's not the case here.
- the front-end (angular), with views, controllers, assets, and calls to the back-end API. As I have only three controllers for the three main pages, I wrote the controllers in a unique file.

## Bugs and feedback
If you find any bug, problem, or if you have any suggestion for improvements, don't hesitate to make a ticket or send me a mail (vporchet@gmail.com). As it's my first Angular app, I probably made some mistakes and/or forgot to use some features provided by Angular. If it's the case, don't hesitate to contact me as well :) 
